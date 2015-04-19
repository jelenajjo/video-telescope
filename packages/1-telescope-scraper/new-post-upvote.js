Template[getTemplate('newPostUpvote')].helpers({
  upvoted: function(){
    var user = Meteor.user();
    if(!user) return false;
    return _.include(this.upvoters, user._id);
  },
    downvoted: function(){
    var user = Meteor.user();
    if(!user) return false;
    return _.include(this.downvoters, user._id);
  }
});
Template.newPostUpvote.events({
    'click .upvote-link': function(e, instance){
    var post = this;
    e.preventDefault();
    if(!Meteor.user()){
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    Meteor.call('upvotePost', post, function(error, result){
      trackEvent("post upvoted", {'_id': post._id});
    });
  },
  'click .downvote-link': function(e, instance){
    var post = this;
    e.preventDefault();
    if(!Meteor.user()){
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    Meteor.call('downvotePost', post, function(error, result){
      trackEvent("post downvoted", {'_id': post._id});
    });
  }
});