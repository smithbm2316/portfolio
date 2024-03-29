export interface LinkWithIcon {
  title: string;
  url: string;
  icon: string;
}

export const internalSiteLinks: LinkWithIcon[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'home',
  },
  {
    title: 'Blog',
    url: '/blog/',
    icon: 'newspaper',
  },
  {
    title: 'RSS',
    url: '/blog/feed.xml',
    icon: 'rss',
  },
  /* {
    title: 'Projects',
    url: '/projects',
    icon: 'briefcase',
  }, */
  {
    title: 'Uses',
    url: '/uses/',
    icon: 'chip',
  },
  {
    title: 'Linktree',
    url: '/me/',
    icon: 'link',
  },
];

export const externalLinks: LinkWithIcon[] = [
  {
    title: 'Email',
    url: 'mailto:bsmithdev@mailbox.org',
    icon: 'mdi:email-open',
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/smithbm2316',
    icon: 'mdi:linkedin',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/smithbm2316',
    icon: 'mdi:github',
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/smithbm2316',
    icon: 'mdi:twitter',
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com/@smithbm2316',
    icon: 'mdi:youtube',
  },
];
