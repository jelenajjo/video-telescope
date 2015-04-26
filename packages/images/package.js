Package.describe({summary: 'Images'});

Package.onUse(function(api) {
  var both = ['client', 'server'];
  api.use([
    'telescope-base',
    'aldeed:autoform',
    'edgee:slingshot@0.6.1',
  ], both);

  api.use([
  ], 'client');

  api.use([
  ], 'server');

  api.addFiles([
    'images.js',
  ], both);

  api.addFiles([
  ], 'client');

  api.addFiles([
  ], ['server']);
});
