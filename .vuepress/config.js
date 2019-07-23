const config = require("../config.json");

module.exports = {
  host: "localhost",
  title: config.title,
  // locales: {
  //   // The key is the path for the locale to be nested under.
  //   // As a special case, the default locale can use '/' as its path.
  //   "/": {
  //     lang: "en-US", // this will be set as the lang attribute on <html>
  //     title: config.title,
  //     description: "CATCO Guide for NDI"
  //   },
  //   "/es/": {
  //     lang: "es",
  //     title: "CATCO Guide",
  //     description: "CATCO Guide for NDI (Spanish)"
  //   }
  // },
  themeConfig: {
    displayAllHeaders: true,
    locales: {
      "/": {
        // text for the language dropdown
        selectText: "Languages",
        // label for this locale in the language dropdown
        label: "English",
        // text for the edit-on-github link
        editLinkText: "Edit this page on GitHub",
        // config for Service Worker
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        // algolia docsearch options for current locale
        algolia: {},
        // nav: [{ text: "Nested", link: "/nested/" }],
        // sidebar: ["/", "/introduction"]
        // sidebar: auto
        sidebar: config.sidebar
      },
      "/es/": {
        selectText: "Languages (ES)",
        label: "Spanish",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        // nav: [{ text: "嵌套", link: "/es/nested/" }],
        algolia: {},
        sidebar: ["/es/", "/es/acronyms"]
      }
    }
  }
};
