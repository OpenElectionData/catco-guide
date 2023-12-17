// 11ty plugins
const pluginRss = require('@11ty/eleventy-plugin-rss');
const { EleventyHtmlBasePlugin } = require('@11ty/eleventy');
const { EleventyI18nPlugin } = require('@11ty/eleventy');
const i18n = require('eleventy-plugin-i18n');
const eleventySass = require('@11tyrocks/eleventy-plugin-sass-lightningcss');

// Helper packages
const slugify = require('slugify');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');

const filters = require('./src/_utils/filters.js');
const translations = require('./src/_data/i18n');

module.exports = function (eleventyConfig) {
  // RSS
  eleventyConfig.addPlugin(pluginRss);

  // Base Url
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Sass
  eleventyConfig.addPlugin(eleventySass);

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true
  })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        // safariReaderFix: true
      }),
      level: [1, 2, 3],
      slugify: (str) =>
        slugify(str, {
          lower: true,
          strict: true,
          remove: /["]/g
        })
    })
    .use(markdownItAttrs, {
      allowedAttributes: ['id', 'class']
    });
  eleventyConfig.setLibrary('md', markdownLibrary);

  // Internationalization
  eleventyConfig.addPlugin(EleventyI18nPlugin, {
    // any valid BCP 47-compatible language tag is supported
    defaultLanguage: 'en',
    errorMode: 'never'
  });

  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en'
    }
  });

  // When `permalink` is false, the file is not written to disk
  eleventyConfig.addGlobalData('eleventyComputed.permalink', function () {
    return (data) => {
      // Always skip during non-watch/serve builds
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return false;
      }

      return data.permalink;
    };
  });

  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
  eleventyConfig.addGlobalData(
    'eleventyComputed.eleventyExcludeFromCollections',
    function () {
      return (data) => {
        // Always exclude from non-watch/serve builds
        if (data.draft && !process.env.BUILD_DRAFTS) {
          return true;
        }

        return data.eleventyExcludeFromCollections;
      };
    }
  );

  eleventyConfig.on('eleventy.before', ({ runMode }) => {
    // Set the environment variable
    if (runMode === 'serve' || runMode === 'watch') {
      process.env.BUILD_DRAFTS = true;
    }
  });

  // Collections
  // eleventyConfig.addCollection('guideLocale', function (collectionApi) {
  //   return collectionApi.getFilteredByTag('guide');
  // });

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });

  // Shortcodes
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  // {% figure %} tag to wrap images and captions in <figure><img><figcaption></figcaption></figure> tags
  eleventyConfig.addPairedShortcode(
    'figure',
    function (content, caption, classes) {
      if (!classes) {
        classes = 'center';
      }

      return `<figure class="${classes}">
    ${markdownLibrary.renderInline(content)}
    <figcaption>${caption}</figcaption>
    </figure>`;
    }
  );

  // {% callout %} tag for content we want to highlight/callout
  eleventyConfig.addPairedShortcode('callout', function (content, attrs) {
    return `<aside class="callout">
      <h3 class="callout__title">${attrs.title}</h3>
      <div class="callout__body">${markdownLibrary.render(content)}</div>
    </aside>`;
  });

  // {% textarea %} tag for form input
  eleventyConfig.addNunjucksShortcode('textarea', function (textarea) {
    let btn = '';

    if (textarea.button.toLowerCase() === 'true') {
      btn = `<button class="btn btn--pdf" data-id="${textarea.id}">Save as PDF</button>`;
    }

    let rows = 5;
    switch (textarea.size.toLowerCase()) {
      case 'small':
        rows = 1;
        break;
      case 'large':
        rows = 10;
        break;
      default:
        rows = 5;
    }

    return `<div class="form-default">
      <label for="${textarea.id}">${textarea.label}</label>
      <textarea class="form-textarea form-textarea--${textarea.size}" name="${textarea.id}" id="${textarea.id}" rows="${rows}"></textarea>
      ${btn}
    </div>`;
  });

  // Layouts
  eleventyConfig.addLayoutAlias('base', 'base.njk');
  eleventyConfig.addLayoutAlias('page', 'page.njk');
  eleventyConfig.addLayoutAlias('search', 'search.njk');

  // Passthrough
  eleventyConfig.addPassthroughCopy('src/_assets/font');
  eleventyConfig.addPassthroughCopy('src/_assets/images');
  eleventyConfig.addPassthroughCopy('src/_assets/js');

  // TEMPORARY
  eleventyConfig.ignores.add('src/{ar,es,fr,ru}/');

  // Configuration
  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
      assets: '_assets'
    },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  };
};
