const site = {
  title: 'Ben Smith - Full Stack Web Developer',
  url: process.env.SITE_ENV === 'production' ? 'https://bensmith.sh' : '',
  author: 'Ben Smith',
  description:
    "I'm a web developer with a passion for the command line, coffee, and crafting delightful user experiences for the web!",
};
site.favicon = `${site.url}/assets/favicon.svg`;

export default site;
