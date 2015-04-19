Package.describe({summary: 'Slug'});

Package.onUse(function(api) {
  var both = ['client', 'server'];
  api.use([
    'iron:router',
  ], both);

  api.use([
  ], 'client');

  api.use([
  ], 'server');

  api.addFiles([
    'router.js',
  ], both);

  api.addFiles([
  ], 'client');

  api.addFiles([
  ], ['server']);
});
