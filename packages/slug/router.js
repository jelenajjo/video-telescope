Meteor.startup(function () {
  Meteor.startup(function () {
    Router.route('/posts/:slug', {
      name: 'post_page_by_slug',
      controller: PostPageController
    });
  });
});
