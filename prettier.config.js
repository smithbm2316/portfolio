/** @type {import("prettier").Config} */
export default {
  // configure prettier to run on .webc, .liquid, and .njk files
  overrides: [
    {
      files: ['./src/**/*.webc', './src/**/*.liquid', './src/**/*.njk'],
      options: {
        parser: 'html',
      },
    },
  ],
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  jsxSingleQuote: true,
  printWidth: 80,
  proseWrap: 'preserve',
  semi: true,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
};
