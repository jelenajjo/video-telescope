Package.describe({summary: 'Image cropper'});

Package.onUse(function(api) {
  var both = ['client', 'server'];
  api.use([
    'telescope-base',
    'telescope-settings',
  ], both);

  api.use([
    'templating',
  ], 'client');

  api.use([
    'http',
    'aldeed:http@0.2.2',
    'matb33:collection-hooks',
  ], 'server');

  api.addFiles([
    'cropper.js',
  ], both);

  api.addFiles([
    'client/helpers.js',
  ], 'client');

  api.addFiles([
    'server/hooks.js',
    'server/methods.js',
  ], ['server']);

  api.addFiles([
  ], both);
});

Npm.depends({
  'request': '2.55.0',
  'gm': '1.17.0',
  'knox': '0.9.2'
});
