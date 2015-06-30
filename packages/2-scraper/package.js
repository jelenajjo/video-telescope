Package.describe({
  summary: 'Our private package that contains all custom features.',
  version: '0.1.0',
  name: 'scraper'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use([
    'telescope:core',
    'telescope:lib',
    'edgee:slingshot@0.6.2',
  ], ['client', 'server']);

  api.use([
    'http',
    'aldeed:http@0.2.2',
  ], 'server');

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // client & server

  api.addFiles([
    'lib/scraper.js',
    'lib/cropper.js',
    'lib/comments.js',
    'lib/slug.js',
    'lib/images.js',
  ], ['client', 'server']);

  // client

  api.addFiles([
    'client/helpers.js',
    'client/post_title.js',

    'client/scraper/autoform-postthumbnail.html',
    'client/scraper/autoform-postthumbnail.js',
    'client/scraper/autoform-postvideo.html',
    'client/scraper/autoform-postvideo.js',
    'client/scraper/autoform-postvideo.js',

    'client/images/autoform.html',
    'client/images/autoform.js',

    'client/scraper/post_thumbnail.scss',
    'client/scraper/post_thumbnail.html',
    'client/scraper/post_thumbnail.js',
    'client/scraper/post_body.html',
    'client/scraper/post_body.js',

    'client/scraper/fill_data.js'
  ], ['client']);

  // server

  api.addFiles([
    'server/scraper/hooks.js',
    'server/scraper/scraper.js',
    'server/scraper/scrapers/xvideos.js',
    'server/scraper/scrapers/xhamster.js',
    'server/directives.js',

    'server/cropper.js',
    'server/slug.js',
  ], ['server']);

  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

});

Npm.depends({
  'request': '2.55.0',
  'gm': '1.17.0',
  'cheerio': '0.19.0',
  'knox': '0.9.2'
});
