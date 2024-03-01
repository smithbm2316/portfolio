import fs from 'fs/promises';

/**
 * Create a string literal union for all our collections and use that in the definitions that we create for the global `collections`, `page`, and `eleventy` variables that Eleventy exposes in our templates. Writes those typescript definitions to `global.d.ts`
 *
 * @param {string[]} collections
 * @returns void
 */
export async function writeGlobalDts(collections) {
  let collectionsUnion = `"${collections.join('" | "')}"`;

  await fs.writeFile(
    'global.d.ts',
    /* typescript */ `export interface EleventyPage {
  url: string;
  fileSlug: string;
  filePathStem: string;
  date: Date;
  inputPath: string;
  outputPath: string;
  outputFileExtension: string;
  lang: string;
}

export interface EleventyCollection {
  page: EleventyPage;
  data: Record<string, any>;
  content: string;
  rawInput: string;
}

export interface EleventyVar {
  version: string;
  generator: string;
  env: Record<string, string>;
}

declare global {
  var collections: Record<${collectionsUnion}, EleventyCollection[]>;
  var page: EleventyPage;
  var eleventy: EleventyVar;
}`
  );
}
