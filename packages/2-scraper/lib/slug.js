Posts.addField({
  fieldName: 'slug',
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      editable: false,
      omit: true
    }
  }
});


/************ ROUTER *************/

var PostSlugPageController = RouteController.extend({
  template: 'post_page',

  waitOn: function() {
    this.postSubscription = coreSubscriptions.subscribe('singlePostBySlug', this.params.slug);
    this.postUsersSubscription = coreSubscriptions.subscribe('postUsersBySlug', this.params.slug);
    this.commentSubscription = coreSubscriptions.subscribe('commentsListBySlug', {view: 'postCommentsBySlug', postId: this.params._id});
  },

  post: function() {
    return Posts.findOne({slug: this.params.slug});
  },

  getTitle: function () {
    if (!!this.post())
      return this.post().title;
  },

  onBeforeAction: function() {
    if (! this.post()) {
      if (this.postSubscription.ready()) {
        this.render(getTemplate('not_found'));
      } else {
        this.render(getTemplate('loading'));
      }
    } else {
      this.next();
    }
  },

  onRun: function() {
    var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
    Meteor.call('increasePostViews', this.post()._id, sessionId);
    this.next();
  },

  data: function() {
    return this.post();
  },
  fastRender: true
});

Meteor.startup(function () {
  Router.route('/p/:slug', {
    name: 'post_page_by_slug',
    controller: PostSlugPageController
  });
});
