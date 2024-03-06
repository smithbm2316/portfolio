import { bundle, transform } from 'lightningcss';

/** @typedef {import('@11ty/eleventy/src/UserConfig').default} EleventyConfig */
/**
 * @typedef {Object} LightningCSSOptions
 * @prop {string} entryPath - The css file to be used as your main entrypoint
 * @prop {Omit<import('lightningcss').BundleOptions<{}>, 'filename'>=} bundle - options to pass to the `bundle()` process
 * @prop {Omit<import('lightningcss').TransformOptions<{}>, 'code' | 'filename'>=} transform - options to pass to the `transform()` process
 * @prop {boolean=} [debug=false] an optional value to turn on debug output for the plugin
 */

/**
 * @param {EleventyConfig} eleventyConfig The eleventy config instance
 * @param {LightningCSSOptions} options Customization options for this plugin
 */
export function pluginLightningCSS(
  eleventyConfig,
  options = {
    debug: false,
    entryPath: '',
    bundle: {},
    transform: {},
  }
) {
  /**
   * Debugging helper that logs error messages to the console when the DEBUG environment variable is provided to Eleventy or `options.debug` is `true`.
   * @param {string} message
   * @returns {void}
   */
  function debug(message) {
    if (process.env.DEBUG === '*' || options.debug) {
      console.debug(`  Eleventy:PluginLightningCSS: ${message}`);
    }
  }

  eleventyConfig.addTemplateFormats('css');
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    /**
     * @param {string} _inputContent the full string for the template that Eleventy is currently processing
     * @param {string} inputPath the path to the template that Eleventy is currently processing
     * @returns {function():Promise<string>|undefined} a `Promise` that returns a `string` or `undefined`
     */
    compile(_inputContent, inputPath) {
      try {
        /**
         * @callback eleventyUrl
         * @param {string} inputUrl the URL to normalize
         * @returns {string} the normalized URL
         */
        /**
         * Eleventy's global `url` filter for normalizing paths
         * @type {eleventyUrl}
         */
        const url = eleventyConfig.getFilter('url');

        /** The normalized path for the current Eleventy template */
        let templatePath = url(inputPath);
        /** The normalized path for the path provided to the plugin in the user's config */
        let entryPath = url(options.entryPath);

        // only process the `options.entryPath` file
        if (templatePath !== entryPath) {
          debug(`Skipping template at "${templatePath}"`);
          return;
        }
        debug(`Processing template "${templatePath}"`);

        // concatenates @imported files into one file, returns the Uint8Array of that bundled CSS file
        debug('Bundling CSS...');
        let { code: bundledCSS } = bundle({
          ...options.bundle,
          filename: templatePath,
        });
        debug('CSS bundled successfully');

        // which we than pump through the transform pipeline
        debug('Transforming CSS...');
        let { code: transformedCSS } = transform({
          ...options.transform,
          filename: templatePath,
          code: bundledCSS,
        });
        debug('CSS transformed successfully');

        return async () => {
          debug(`Bundled and transformed "${templatePath}" successfully`);
          return transformedCSS.toString();
        };
      } catch (_err) {
        console.error(
          '[eleventy-plugin-lightningcss] There was an error processing your CSS template.'
        );
      }
    },
  });

  eleventyConfig.addFilter(
    'lightningCSS',
    /**
     * @param {string} input the content to parse with lightningCSS
     * @returns {string} CSS parsed with lightningCSS `transform`
     */
    (input) => {
      try {
        debug('Processing content through lightningCSS filter');
        if (typeof input !== 'string') {
          throw new Error(
            `Content passed to the \`lightningCSS\` filter was not of type "string", it was type "${typeof input}" instead.`
          );
        }

        // which we than pump through the transform pipeline
        debug('Transforming CSS...');
        let { code: transformedCSS } = transform({
          ...options.transform,
          filename: 'lightningCSS filter',
          code: Buffer.from(input),
        });
        debug('CSS transformed successfully');

        return transformedCSS.toString();
      } catch (error) {
        console.error(
          '[eleventy-plugin-lightningcss] There was an error processing your CSS with the `lightningCSS` filter.'
        );
        console.error(error);
      }
    }
  );
}
