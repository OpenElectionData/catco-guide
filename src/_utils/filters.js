const { parseHTML } = require('linkedom');
const site = require('../_data/site.js');
const locales = require('../_data/locales.js');

module.exports = {
  /**
   * Prefixes the given URL with the site's base URL.
   * @param {string} url
   */
  absoluteUrl: (url) => {
    return new URL(url, site.baseUrl).href;
  },
  /**
   * Get the corresponding label for a given language code
   * @param {string} locale Locale code
   * @returns Label for given locale
   */
  getLocaleLabel: (locale) => {
    return locales.find((d) => d.code === locale)?.label;
  },
  /**
   * Create a length-based excerpt for content.
   * @param {string} content Page content
   * @param {Number} length Length to cut the excerpt to
   * @returns Excerpt from page content
   */
  createExcerpt: (content, length = 100) => {
    const contentModified = content.replace(/(<([^>]+)>)/gi, '');
    return (
      contentModified.substring(0, contentModified.lastIndexOf(' ', length)) +
      '...'
    );
  },
  /**
   * Filter a collection by the language code
   * @param {Array} collection Items in a collection
   * @param {String} lang Language to filter collection by
   * @returns Filtered collection by language
   */
  filterCollectionByLocale: (collection, locale) => {
    return collection.filter((c) => c.data?.locale === locale);
  },
  /**
   * Filter and sort a collection by a given property. Used for generating ToC.
   * @param {Array} collection Items in a collection
   * @param {String} key Property of collection to filter & sort by
   * @returns Sorted and filtered collection
   */
  sortCollectionByKey: (collection, key) => {
    return collection
      .filter((c) => c && c.data[key])
      .sort((a, b) => a.data[key] - b.data[key]);
  },
  /**
   * Get the index of the current item in the collection
   * @param {Array} collection Items in a collection
   * @param {String} slug Slug to find
   * @returns Index of the item in a collection
   */
  getCurrentItemIndex: (collection, slug) => {
    return collection.findIndex((c) => c && c.page.url === slug);
  },
  /**
   * Get the h2 headings from content to create a table of contents in our menu when we're on the page.
   * @param {String} content Page content
   * @returns The headers for the page
   */
  getSubheadings: (content) => {
    const { document } = parseHTML(content);

    const headerEls = document.querySelectorAll('h2 .header-anchor');

    let headers = [];

    if (!headerEls.length) {
      return headers;
    }

    headerEls.forEach((header) => {
      headers.push({
        slug: header.getAttribute('href'),
        title: header.innerText
      });
    });

    return headers;
  },
  parseSeachData: (content) => {
    return content.replaceAll('\n', '');
  }
};
