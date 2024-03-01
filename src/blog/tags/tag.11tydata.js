export default {
  pagination: {
    data: 'collections',
    size: 1,
    alias: 'tag',
    before: function (tags, data) {
      let filteredTags = tags.filter(
        (tag) =>
          data.collections.postTags.includes(tag) &&
          data.collections[tag].length > 0
      );
      return filteredTags;
    },
  },
  permalink: function ({ tag }) {
    return `/blog/tags/${this.slugify(tag)}/`;
  },
};
