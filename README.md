# bensmith.sh - My website

## `@11ty/eleventy-plugin-bundle` patch

- [Discord reference point](https://discordapp.com/channels/741017160297611315/1106414159157014529/1106414159157014529)

It looks like the `css` shortcode created for 11ty's WebC plugin bucketing has _one_ spot that tries to access the `page.url` value and since `page` _itself_ is `undefined`, so is `page.url`, and that throws an error breaking my build when using `permalink:false`.
