# Notes for portfolio

## Resources

- [Ryan explaining how a Remix route works with detailed comments](https://gist.github.com/ryanflorence/ddc5604a8ae9e068ef4e4478e8fa845a)



## Blog posts

- Use [Octokit](https://github.com/octokit/octokit.js) from GitHub to request our markdown blog posts from `/posts` in this repo
- Write a GitHub Action to purge the Cloudflare cache anytime that we make an update to a blog post in `/posts` so that we know to revalidate the content via the GitHub API and don't serve our users stale content
  - [Purging by URL](https://developers.cloudflare.com/cache/how-to/purge-cache/#purge-by-single-file-by-url)
  - [Purging by cache tags](https://developers.cloudflare.com/cache/how-to/purge-cache/#purge-using-cache-tags)
  - [Cloudflare blog post detailing these ideas](https://blog.cloudflare.com/introducing-a-powerful-way-to-purge-cache-on-cloudflare-purge-by-cache-tag/)
  - [Proof of concept for github api caching in remix](https://github.com/mkartchner994/github-contents-cache)



## Content

- Add a `/uses` page to list my tools, setup, tech, etc like on [Wes Bos's site](https://wesbos.com/uses). Should add my url to his [Uses repo](https://uses.tech/) when I'm done!
- Add a `/business-card` page as a linktree-esque page to list all of my important links
- Add a `/notes`, `/notebook`, or `/digital-garden` link to where I can add a tree of notes that I have been accumulating. Could maybe also use the Octokit API to pull a list of my public notes or individual notes from another GitHub repo where I keep them.
- Add a `/bookmarks` page where I can have a list of a bunch of cool articles or resources that I have read/watched and would like people to be able to see (or myself when I can't remember the resource I want). Add a search for these too!
- Add resource routes for a Resume, RSS feed, etc
- Add some themes so that my site can have a fun 80's synthwave-inspired theme, but can also have some more professional/elegant/refined themes if people prefer those



## Miscellaneous

- Read request headers to add data saving when the browser specifies the ("Save-Data" header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Save-Data).
- New email address on my domain? `ben@smithbm.dev`, `me@smithbm.dev`, `hello@smithbm.dev`, `shout@smithbm.dev`, etc (this isn't portfolio related but a neat idea i don't wanna forget)
