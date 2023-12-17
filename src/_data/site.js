const isDev = process.env.ELEVENTY_RUN_MODE !== 'build';

module.exports = {
  isDev,
  title: 'Raising Voices in Closing Spaces',
  title_full: 'Raising Voices in Closing Spaces',
  title_full_br: 'Raising Voices in <br />Closing Spaces',
  subtitle:
    'Strategic Communications Planning for Nonpartisan Citizen Election Observer Groups',
  description:
    'This guide offers a step-by-step approach to strategic communications planning and programming in closing political spaces. It offers strategies, tactics and case studies for civil society groups operating in repressive environments.',
  email: 'openelectiondata@ndi.org',
  facebook_username: 'National.Democratic.Institute',
  twitter_username: 'ndi',
  instagram_username: 'ndidemocracy',
  baseurl: '',
  url: isDev ? 'http://localhost:8080' : 'https://raiseavoice.net'
};
