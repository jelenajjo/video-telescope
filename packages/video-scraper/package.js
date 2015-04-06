Package.describe({summary: 'Video scraper'});

Package.onUse(function(api) {
  var both = ['client', 'server'];
  api.use([
    'telescope-base',
    'tap:i18n',
    'aldeed:autoform'
  ], both);

  api.use([
    'templating',
    'fourseven:scss'
  ], 'client');

  api.use([
  ], 'server');

  api.addFiles([
    'both/common.js'
  ], both);

  api.addFiles([
    'client/autoform-postthumbnail.html',
    'client/autoform-postthumbnail.js',
    'client/autoform-postvideo.html',
    'client/autoform-postvideo.js',

    'client/post_thumbnail.scss',
    'client/post_thumbnail.html',
    'client/post_thumbnail.js',
    'client/post_body.html',

    'client/fill_data.js'
  ], 'client');

  api.addFiles([
  ], ['server']);

  api.addFiles([
    "i18n/en.i18n.json"
  ], both);

  api.export([
    'Feeds'
  ]);
});
