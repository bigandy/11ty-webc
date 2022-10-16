const slinkity = require('slinkity');
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginWebc = require("@11ty/eleventy-plugin-webc");
const { DateTime } = require('luxon');

const getNumberSuffix = (num) => {
	const th = 'th';
	const rd = 'rd';
	const nd = 'nd';
	const st = 'st';

	if (num === 11 || num === 12 || num === 13) return th;

	const lastDigit = num.toString().slice(-1);

	switch (lastDigit) {
		case '1':
			return 'st';
		case '2':
			return 'nd';
		case '3':
			return 'rd';
		default:
			return 'th';
	}
};

const readableDate = (dateObj) => {
	const formatDate = DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
		'd-LLLL-yyyy'
	);

	const [day, month, year] = formatDate.split('-');
	const outputDay = `${day}${getNumberSuffix(day)}`;

	return `${outputDay} ${month} ${year}`;
};

const firstNElements = (array, n) => {
	if (n < 0) {
		return array.slice(n);
	}

	return array.slice(0, n);
};

const htmlDateString = dateObj => {
	return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(pluginWebc, {
    components: "_includes/components/**/*.webc",
  });
  eleventyConfig.addPlugin(slinkity.plugin, slinkity.defineConfig({
    renderers: [],
  }));

  eleventyConfig.addFilter('firstNElements', firstNElements);
  eleventyConfig.addFilter('htmlDateString', htmlDateString);
  eleventyConfig.addFilter('readableDate', readableDate);

  readableDate

  eleventyConfig.addCollection('posts', (collection) => {
    const returnPostCollection = collection
      .getFilteredByGlob('./src/posts/**/*.md');
      // .filter(showWeeknotes)
      // .filter(livePosts)
      // .filter(removeDrafts);

    return returnPostCollection;
  });


  /**
   * Why copy the /public directory?
   * 
   * Slinkity uses Vite (https://vitejs.dev) under the hood for processing styles and JS resources
   * This tool encourages a /public directory for your static assets like social images
   * To ensure this directory is discoverable by Vite, we copy it to our 11ty build output like so:
   */
  eleventyConfig.addPassthroughCopy('public')

  return {
    /**
     * Why use Nunjucks?
     * 
     * We recommend using Nunjucks over Liquid for nicer component shortcode syntax in your markdown
     * See our docs on passing props to components here: https://slinkity.dev/docs/component-shortcodes/#passing-props-to-shortcodes
     * Prefer liquid, or don't mind liquid's shortcode syntax? No problem!
     * Just delete this line to switch back to liquid:
     */
    markdownTemplateEngine: 'njk',
    dir: {
      /**
       * Why set an input directory?
       * 
       * By default, 11ty will treat the base of your project as the input.
       * This can have some nasty consequences, like accidentally copying your README.md as a route!
       * You can manually ignore certain files from the build output. But to keep things simple,
       * We recommend setting an input directory like so:
       */
      input: 'src',
    },
  }
}