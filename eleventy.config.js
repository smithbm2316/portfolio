/** @typedef {import('@11ty/eleventy/src/UserConfig').default} UserConfig */

// 11ty plugins
import pluginDirectoryOutput from '@11ty/eleventy-plugin-directory-output';
import { EleventyRenderPlugin as pluginRender } from '@11ty/eleventy';
// import pluginRSS from '@11ty/eleventy-plugin-rss';
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginValidate from 'eleventy-plugin-validate';
import pluginWebc from '@11ty/eleventy-plugin-webc';

// dependencies
import markdownItAnchor from 'markdown-it-anchor';
import slugify from '@sindresorhus/slugify';

// rest of my eleventy config in the `./config` folder
import { schemas } from './config/schemas.js';
import { writeGlobalDts } from './config/globals.js';

/**
 * @param {UserConfig} eleventyConfig - Eleventy configuration object
 * @returns {Record<string, unknown>} Final configuration that we give to Eleventy
 */
export default function configureEleventy(eleventyConfig) {
  /** @see {@link https://www.11ty.dev/docs/config/#configuration-options Configuration Options} */
  const config = {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['html', 'md', 'njk', '11ty.js', 'webc'],
  };

  // enable markdown headings getting turned into links automatically, using the same `slugify` function on the heading names as eleventy provides globally from `@sindresorhus/slugify`
  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.use(markdownItAnchor, {
      slugify,
      level: [2, 3, 4, 5, 6],
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
      }),
    });
  });

  // create a collection that only contains the list of tags attached to posts
  eleventyConfig.addCollection('postTags', (collection) => {
    /** @type {Set<string>} */
    let tagsSet = new Set();
    let all = collection.getAll();
    let tagsToExclude = [
      'all',
      'posts',
      'postTags',
      'eleventy-plugin-validate',
    ];

    for (let item of all) {
      if (!item.data.tags) {
        continue;
      }
      for (let tag of item.data.tags) {
        if (tagsToExclude.includes(tag)) {
          continue;
        }
        tagsSet.add(tag);
      }
    }

    /** @type {string[]} */
    return Array.from(tagsSet).sort();
  });

  // tell eleventy to ignore any markdown files in our blog that have a leading underscore "_" in the filename when we are building for production. Continue to process and show them when in `serve`/`watch` mode for development purposes! This allows us to have any blog posts that should be drafts staying out of our production builds by just adding an underscore to the beginning of the filename.
  // https://github.com/11ty/eleventy/issues/188#issuecomment-1156986504
  if (process.env.ELEVENTY_RUN_MODE === 'build') {
    eleventyConfig.ignores.add(`${config.dir.input}/blog/**/_*.md`);
  }

  // configure the `src/assets` directory to be copied into our build without Eleventy processing the files. This is where all our fonts, images, styles, and other assets will go
  eleventyConfig.addPassthroughCopy(`${config.dir.input}/assets`);

  /*
   * PLUGINS
   */
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(pluginDirectoryOutput);

  eleventyConfig.addPlugin(pluginRender);

  // eleventyConfig.addPlugin(pluginRSS);

  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addPlugin(pluginValidate, {
    validator: 'zod',
    schemas,
  });

  eleventyConfig.addPlugin(pluginWebc, {
    components: [
      // any `.webc` files found in the top-level of our `includes` directory or in the `components` directory inside of our `includes` directory will be processed as global webc components.
      `${config.dir.input}/${config.dir.includes}/*.webc`,
      `${config.dir.input}/${config.dir.includes}/components/*.webc`,
      // include <syntax-highlight> web component from 11ty plugin
      'npm:@11ty/eleventy-plugin-syntaxhighlight/*.webc',
    ],
  });
  /* END PLUGINS */

  eleventyConfig.setServerOptions({
    port: 2323,
    watch: [`${config.dir.output}/assets/styles/**/*.css`],
  });

  eleventyConfig.on('eleventy.after', async ({ uses: { nodes } }) => {
    /** @type {string[]} */
    let collections = [];
    for (let /** @type {string} */ node of Object.keys(nodes)) {
      if (node.startsWith('__collection:')) {
        let collection = node.replace('__collection:', '');
        collections.push(collection);
      }
    }

    await writeGlobalDts(collections);
  });

  return config;
}
