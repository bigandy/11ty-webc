const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginWebc = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginWebc, {
    components: "_includes/components/**/*.webc",
  });

  eleventyConfig.addPassthroughCopy("public");

  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPassthroughCopy({ public: "." });

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
    },
  };
};
