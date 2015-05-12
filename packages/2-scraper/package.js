Package.describe({
  summary: 'Our private package that contains all custom features.',
  version: '0.1.0',
  name: 'scraper'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use("telescope:core");

  // ---------------------------------- 2. Files to include ----------------------------------

  // i18n config (must come first)

  api.addFiles([
    'package-tap.i18n'
  ], ['client', 'server']);

  // client & server

  api.addFiles([
  ], ['client', 'server']);

  // client

  api.addFiles([
    'client/post_title.js'
  ], ['client']);

  // server

  api.addFiles([
  ], ['server']);

  // i18n languages (must come last)

  api.addFiles([
    'i18n/en.i18n.json'
  ], ['client', 'server']);

});
