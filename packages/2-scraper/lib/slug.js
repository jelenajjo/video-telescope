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
      return this.post().title.substring(0, 55);
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
    if (this.post()) {
      var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
      Meteor.call('increasePostViews', this.post()._id, sessionId);
    }
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

Posts.getLink = function (post, isAbsolute) {
  return this.getPageUrl(post, isAbsolute);
};
Posts.helpers({getLink: function (isAbsolute) {return Posts.getLink(this, isAbsolute);}});

Posts.getPageUrl = function(post, isAbsolute){
  isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + (!!post.slug ? "/p/"+post.slug : "/posts/"+post._id);
};
Posts.helpers({getPageUrl: function (isAbsolute) {return Posts.getPageUrl(this, isAbsolute);}});
