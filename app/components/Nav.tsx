interface NavLink {
  title: string;
  url: string;
  icon: string;
}

const navigation: NavLink[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'home',
  },
  {
    title: 'About',
    url: '/about',
    icon: 'person',
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: 'briefcase',
  },
  {
    title: 'Blog',
    url: '/blog',
    icon: 'newspaper',
  },
  {
    title: 'Github',
    url: 'https://github.com/smithbm2316',
    icon: 'github',
  },
  {
    title: 'Email',
    url: 'mailto:bsmithdev@mailbox.org',
    icon: 'email',
  },
  {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/smithbm2316',
    icon: 'linkedin',
  },
];

export default function Nav() {
  return (
    <nav>
      {navigation?.map(({ title, url, icon }) => (
        <a key={title} href={url}>
          {title}
        </a>
      ))}
    </nav>
  );
}
