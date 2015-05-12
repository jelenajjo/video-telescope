Package.describe({summary: 'Slug'});

Package.onUse(function(api) {
  var both = ['client', 'server'];
  api.use([
    'telescope:core',
    'iron:router',
  ], both);

  api.use([
  ], 'client');

  api.use([
  ], 'server');

  api.addFiles([
    'slug.js',
    'router.js',
  ], both);

  api.addFiles([
  ], 'client');

  api.addFiles([
    'server/publications.js',
    'server/hooks.js',
  ], ['server']);
});
