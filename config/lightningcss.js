import { bundle, transform } from 'lightningcss';
import fs from 'fs';

/** @typedef {import('@11ty/eleventy/src/UserConfig').default} EleventyConfig */
/**
 * @typedef {Object} LightningCSSOptions
 * @prop {string} outputPath - the final path for the processed CSS file
 * @prop {import('lightningcss').BundleOptions<{}>} bundle - options to pass to the `bundle()` process
 * @prop {Omit<import('lightningcss').TransformOptions<{}>, 'code'>} transform - options to pass to the `transform()` process
 */

/**
 * @param {string} message
 */
function debug(message) {
  if (process.env.DEBUG === '*') {
    console.debug(`  Eleventy:PluginLightningCSS: ${message}`);
  }
}

/**
 * @param {EleventyConfig} eleventyConfig - The eleventy config instance
 * @param {LightningCSSOptions} options - Customization options for this plugin
 */
export function pluginLightningCSS(eleventyConfig, options) {
  eleventyConfig.on('eleventy.after', () => {
    try {
      // concatenates @imported files into one file, returns the Uint8Array of that bundled CSS file
      debug('Bundling CSS...');
      let { code: bundledCSS } = bundle(options.bundle);
      debug('CSS bundled successfully');

      // which we than pump through the transform pipeline
      debug('Transforming CSS...');
      let { code: transformedCSS } = transform({
        ...options.transform,
        code: bundledCSS,
      });
      debug('CSS transformed successfully');

      // and write it to disk on the specified `options.outputPath` location
      debug(`Writing file to "${options.outputPath}"...`);
      fs.writeFileSync(options.outputPath, transformedCSS, {
        flag: 'w',
        encoding: 'utf-8',
      });
      debug(`Wrote file to "${options.outputPath}" successfully`);

      console.log(
        `[eleventy-plugin-lightningcss] Bundled and transformed "${options.bundle.filename}" to "${options.outputPath}" succesfully`
      );
    } catch (_err) {
      console.error(
        '[eleventy-plugin-lightningcss] There was an error processing your CSS.'
      );
    }
  });
}
