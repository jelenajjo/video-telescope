Template.post_body.replaces('post_body');

Template.post_body.onCreated(function() {
  this.ready = new ReactiveVar(false);
});

Template.post_body.onRendered(function() {
  var self = this;
  var data = Template.currentData();

  if (!data.originUrl || !data.videoLocation || data.videoLocation === 's3') {
    self.ready.set(true);
    return;
  }

  Meteor.call('updateVideoUrl', data._id, function (error) {
    if (error) {
      console.log(error);
    }

    self.ready.set(true);
  });
});

Template.post_body.helpers({
  ready: function() {
    return Template.instance().ready.get();
  }
});

Template.video_post_body.replaces('post_body');
