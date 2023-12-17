const en = require('./en.js');
const es = require('./es.js');
const fr = require('./fr.js');
const ar = require('./ar.js');
const ru = require('./ru.js');

const locales = {
  en,
  es,
  fr,
  ar,
  ru
};

const localizedStrings = {};

for (const lang in locales) {
  if (Object.hasOwnProperty.call(locales, lang)) {
    const strings = locales[lang];

    Object.keys(strings).forEach((string) => {
      if (!localizedStrings[string]) {
        localizedStrings[string] = {};
      }

      localizedStrings[string][lang] = strings[string];
    });
  }
}

module.exports = localizedStrings;
