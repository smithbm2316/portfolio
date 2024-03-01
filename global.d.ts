export interface EleventyPage {
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
  var collections: Record<"all" | "posts" | "astro" | "rss" | "open-web", EleventyCollection[]>;
  var page: EleventyPage;
  var eleventy: EleventyVar;
}