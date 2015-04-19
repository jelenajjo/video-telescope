Package.describe({summary: 'SEO'});

Package.onUse(function(api) {
  api.use([
    'meteorhacks:ssr@2.1.1',
    'meteorhacks:picker@1.0.2',
  ], 'server');

  api.addFiles([
    'server/router.js',
  ], ['server']);
});
