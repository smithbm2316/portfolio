class Sitemap {
  data() {
    return {
      permalink: '/sitemap-from-js.xml',
      eleventyExcludeFromCollections: true,
    };
  }

  render({ site, collections }) {
    let content = '';
    content += /* xml */ `<?xml version="1.0" encoding="utf-8"?>`;
    content += /* xml */ `<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">`;
    for (let page of collections.all) {
      content += /* xml */ `<url>`;
      content += /* xml */ `<loc>${site.url}${page.url}</loc>`;
      content += /* xml */ `<lastmod>${page.date.toISOString()}</lastmod>`;
      content += /* xml */ `</url>`;
    }
    content += /* xml */ `</urlset>`;

    return content;
  }
}

export default Sitemap;
