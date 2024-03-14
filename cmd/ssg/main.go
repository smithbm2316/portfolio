package main

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"bensmith.sh/models"
	"bensmith.sh/views"

	"github.com/a-h/templ"
	chroma "github.com/alecthomas/chroma/v2"
	chromahtml "github.com/alecthomas/chroma/v2/formatters/html"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark-meta"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
)

var Dirs = models.Directories{
	Build:   "src",
	Content: "content",
	Posts:   "content/words",
	Views:   "views",
}

func main() {
	// inject Dirs into "models" package
	models.Dirs = Dirs

	// create build directory for output
	if err := os.MkdirAll(Dirs.Build, os.ModePerm); err != nil {
		log.Fatalf("failed to create output directory: %v", err)
	}

	// setup file writer for chroma CSS generation, we want to write it to a static CSS file that targets the "chroma" class instead of using inline HTML styles
	chromaCSSPath := filepath.Join(Dirs.Build, "chroma.css")
	chromaCSSFile, err := os.Create(chromaCSSPath)
	if err != nil {
		log.Fatalf("failed to create output file: %v", err)
	}
	defer chromaCSSFile.Close()

	// setup markdown parser and metadata context
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			meta.Meta,
			highlighting.NewHighlighting(
				highlighting.WithStyle("catppuccin-mocha"),
				// consume the io.Write we just created
				highlighting.WithCSSWriter(chromaCSSFile),
				highlighting.WithFormatOptions(
					chromahtml.TabWidth(2),
					// make sure we use class generation over inline styles
					chromahtml.WithClasses(true),
					// make sure that <pre> tags overflow
					chromahtml.WithCustomCSS(map[chroma.TokenType]string{
						chroma.PreWrapper: "overflow-x: auto; padding: 1em; border-radius",
					}),
				),
			),
		),
		goldmark.WithParserOptions(
			parser.WithAttribute(),
			parser.WithAutoHeadingID(),
		),
	)
	metadataContext := parser.NewContext()

	// generate posts and all their tags
	posts, tags := generatePostsAndTags(md, metadataContext)
	// generate all markdown pages
	pages := generatePages(md, metadataContext)

	// create all my routes
	generateOutputFile("/", views.IndexRoute())
	generateOutputFile("/words", views.BlogRoute(posts, tags))
	for _, post := range posts {
		generateOutputFile(post.Slug, views.PostRoute(post))
	}
	generateOutputFile("/tags", views.TagsRoute(tags))
	for _, tag := range tags {
		generateOutputFile(fmt.Sprintf("/tags/%s", tag), views.TagRoute(tag, posts))
	}
	generateOutputFile("/feeds", views.FeedsRoute(posts))
	generateOutputFile("404.html", views.ErrorNotFound())
	for _, page := range pages {
		generateOutputFile(page.Slug, views.MarkdownPageRoute(page))
	}

	// Log successful completion of all the generation and exit
	fmt.Printf("Generated static files to %s\n", Dirs.Build)
}

func generateOutputFile(slug string, component templ.Component) {
	var dir, htmlFilePath string

	// if our `slug` is a `.html` file, we want to generate a root-level file with the exact
	// name of our slug. Otherwise the default behavior is to treat the slug as a URL and to
	// generate a `index.html` file inside of the directory path that the `slug` gives us
	if filepath.Ext(slug) == ".html" {
		dir = filepath.Join(Dirs.Build)
		htmlFilePath = filepath.Join(dir, slug)
	} else {
		dir = filepath.Join(Dirs.Build, slug)
		htmlFilePath = filepath.Join(dir, "index.html")
	}

	// create the necessary directory structure with `mkdir -p`
	if err := os.MkdirAll(dir, 0755); err != nil && err != os.ErrExist {
		log.Fatalf("failed to create dir %q: %v", dir, err)
	}

	// open and create the file writer
	file, err := os.Create(htmlFilePath)
	if err != nil {
		log.Fatalf("failed to create output file: %v", err)
	}

	// render the specified template to the file writer
	err = component.Render(context.Background(), file)
	if err != nil {
		log.Fatalf("failed to write blog index page: %v", err)
	}
	file.Close()

	// log succesful creation
	fmt.Printf("Created %s at %s\n", slug, htmlFilePath)
}

func generatePostsAndTags(md goldmark.Markdown, metadataContext parser.Context) ([]*models.Post, []string) {
	var posts = make([]*models.Post, 0)

	if err := filepath.WalkDir(Dirs.Posts, func(path string, d fs.DirEntry, err error) error {
		// handle errors with reading the directory
		if err != nil {
			return err
		}
		// skip processing directories and files that aren't markdown
		if d.IsDir() || filepath.Ext(path) != ".md" {
			return nil
		}

		post, err := models.NewPost(md, metadataContext, path)
		if err != nil {
			log.Fatalf("Failed to create new post from '%s'", path)
		}
		posts = append(posts, post)

		return nil
	}); err != nil {
		log.Fatal("There was an issue generating posts in the `filepath.WalkDir` function")
	}

	// sort the list of posts so that the newest posts are first
	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Published.After(posts[j].Published)
	})

	// create a map with empty structs as value since they don't allocate
	// any memory, so we can create a set of unique tags
	var tagsSet = make(map[string]struct{})
	for _, post := range posts {
		for _, tag := range post.Tags {
			if _, isPresent := tagsSet[tag]; !isPresent {
				tagsSet[tag] = struct{}{}
			}
		}
	}
	// then allocate a slice of strings which has a capacity of the length of our set
	tags := make([]string, 0, len(tagsSet))
	// append all our tags in our set to the string slice
	for tag := range tagsSet {
		tags = append(tags, tag)
	}
	// and sort it before returning it
	sort.Strings(tags)

	return posts, tags
}

func generatePages(md goldmark.Markdown, metadataContext parser.Context) []*models.Page {
	var pages = make([]*models.Page, 0)

	if err := filepath.WalkDir(Dirs.Content, func(path string, d fs.DirEntry, err error) error {
		// handle errors with reading the directory
		if err != nil {
			return err
		}
		// skip processing directories and files that aren't markdown, and don't process any directories that are in the Dirs.Posts directory
		if d.IsDir() || filepath.Ext(path) != ".md" || strings.Contains(path, Dirs.Posts) {
			return nil
		}

		page, err := models.NewPage(md, metadataContext, path)
		if err != nil {
			log.Fatalf("Failed to create new post from '%s'", path)
		}
		pages = append(pages, page)

		return nil
	}); err != nil {
		log.Fatal("There was an issue generating pages in the `filepath.WalkDir` function")
	}

	return pages
}
