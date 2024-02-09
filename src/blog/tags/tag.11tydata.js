export default {
  pagination: {
    data: 'collections.postTags',
    size: 1,
    alias: 'tag',
  },
  permalink: ({ tag }) => `/blog/tags/${tag}/`,
};
