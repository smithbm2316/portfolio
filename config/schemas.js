import { z } from 'zod';

/** @typedef {Parameters<import('eleventy-plugin-validate').default>[1]} PluginValidateOptions */
/** @type {PluginValidateOptions['schemas']} */
const schemas = [];

// basic frontmatter that all of our blog posts with the `posts` tag should have
schemas.push({
  collections: ['posts'],
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),

    description: z.string().optional(),
    showMeTheCode: z.boolean().optional(),
    eleventyExcludeFromCollections: z.boolean().optional(),
    layout: z.string().optional(),
    markdownTemplateEngine: z.string().optional(),
    permalink: z
      .union([
        z.string().refine((permalink) => {
          // ensure that our permalinks either both start and end with a forward slash or that we have no slashes at all (i.e. a top-level link)
          if (!permalink.startsWith('/')) {
            return true;
          } else if (permalink.endsWith('/')) {
            return true;
          }
          return false;
        }, 'Make sure to add a trailing slash to your permalink if you have a leading forward slash.'),
        z.boolean(),
      ])
      .optional(),
  }),
});

export { schemas };
