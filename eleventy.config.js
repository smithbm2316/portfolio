/** @typedef {Partial<import('@11ty/eleventy/src/defaultConfig').defaultConfig>} EleventyConfigReturn */
/** @typedef {import('@11ty/eleventy/src/UserConfig').default} UserConfig */

import directoryOutputPlugin from '@11ty/eleventy-plugin-directory-output';
import pluginWebc from '@11ty/eleventy-plugin-webc';

/**
 * @param {UserConfig} eleventyConfig - Eleventy configuration object
 * @returns {EleventyConfigReturn} Final configuration that we give to Eleventy
 */
export default function configureEleventy(eleventyConfig) {
  /** @type {EleventyConfigReturn} */
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

  // create a collection that only contains the list of tags attached to posts
  eleventyConfig.addCollection('postTags', (collection) => {
    /** @type {Set<string>} */
    let tagsSet = new Set();
    let ignoredTags = ['posts', 'all'];
    let all = collection.getAll();

    for (let item of all) {
      if (!item.data.tags) {
        continue;
      }
      for (let tag of item.data.tags) {
        if (ignoredTags.includes(tag)) {
          continue;
        }
        tagsSet.add(tag);
      }
    }

    /** @type {string[]} */
    return Array.from(tagsSet).sort();
  });

  // add webc
  eleventyConfig.addPlugin(pluginWebc);

  // add asset folders to passthrough
  // DO NOT add /assets/styles.css, since it will overwrite what our tailwind build process adds to our output folder for us
  eleventyConfig.addPassthroughCopy(`${config.dir.input}/assets/fonts`);
  eleventyConfig.addPassthroughCopy(`${config.dir.input}/assets/icons`);
  eleventyConfig.addPassthroughCopy(`${config.dir.input}/assets/images`);

  // directory output plugin
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(directoryOutputPlugin);

  // dev server options
  eleventyConfig.setServerOptions({
    port: 2323,
    watch: [`${config.dir.output}/assets/styles.css`],
  });

  return config;
}
