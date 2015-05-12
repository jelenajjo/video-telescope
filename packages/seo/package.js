Package.describe({summary: 'SEO'});

Package.onUse(function(api) {
  api.use([
    'webapp',
    'meteorhacks:ssr@2.1.1',
    'meteorhacks:picker@1.0.2',
    'momentjs:moment',
    'scraper',
    'templating',
    'underscore',
    'iron:router',
    'telescope:core',
  ], 'server');

  api.addFiles([
    'private/views/common/css.html',
    'private/views/common/layout.html',
    'private/views/common/open-graph.html',
    'private/views/nav/nav.html',
    'private/views/posts/modules/post-author.html',
    'private/views/posts/modules/post-content.html',
    'private/views/posts/modules/post-info.html',
    'private/views/posts/post-body.html',
    'private/views/posts/post-item.html',
    'private/views/posts/post-page.html',
    'private/views/main.html',
    'private/views/noindex.html',
    ], 'server',{isAsset:true});

  api.addFiles([
    'server/router.js',
    'server/templates.js',
    'server/sitemap.js',
  ], ['server']);
});
