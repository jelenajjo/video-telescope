Package.describe({
  summary: 'Telescope custom package',
  version: '1.0.0',
  name: '1-telescope-scraper'
});

Package.onUse(function (api) {
  api.use('telescope-base');
  api.use('templating');
  api.use('tap:i18n');
  api.use('twbs:bootstrap@3.3.4', 'client');
  api.use('natestrauser:font-awesome@4.3.0', 'client');

  api.addFiles('newTemplates.js', 'client');
  api.addFiles('style.css', 'client');
  api.addFiles('new-nav.html' , 'client');
  api.addFiles('post-bottom.html' , 'client');
  api.addFiles('new-post-page.html' , 'client');
  api.addFiles('new-layout.html' , 'client');
  api.addFiles('new-post-page.js' , 'client');
  api.addFiles('post-bottom.js' , 'client');
  api.addFiles('new-comment-form.html' , 'client');
  api.addFiles('new-comment-item.html' , 'client');
  api.addFiles('new-post-upvote.html' , 'client');
  api.addFiles('new-post-upvote.js' , 'client');

  api.addFiles('new-submit-button.html' , 'client');
  api.addFiles('new-user-menu.html' , 'client');
  api.addFiles('new-user-menu.js' , 'client');
  api.addFiles('new-post-title.html' , 'client');
  api.addFiles('new-nav.js' , 'client');
  api.addFiles('package-tap.i18n' , ['server', 'client']);
});
