Template.post_upvote.helpers({
  downvoted: function() {
    var user = Meteor.user();
    if(!user) return false;
    return _.include(this.downvoters, user._id);
  }
});

Template.post_upvote.events({
  'click .downvote-link': function(e) {
    var post = this;
    e.preventDefault();
    if(!Meteor.user()) {
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    Meteor.call('downvotePost', post, function(){
      Events.track("post downvoted", {'_id': post._id});
    });
  }
});
