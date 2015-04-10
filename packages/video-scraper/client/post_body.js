Template.video_post_body.onCreated(function() {
  this.isReady = new ReactiveVar(false);
});

Template.video_post_body.onRendered(function() {
  var data = Template.currentData();
  var self = this;

  if (!data.originUrl || !data.videoLocation || data.videoLocation === 's3') {
    self.isReady.set(true);
    return;
  }

  if (data.videoLocation === 'xvideo') {
    Meteor.call('scraperGetData', data.originUrl, function (error, res) {
      if (error) {
        console.log(error);
      } else if (res) {
        if (res.videoUrl) {
          data.videoUrl = 'dfsdfsaf';
        }
      }

      self.isReady.set(true);
    });
  } else {
    self.isReady.set(true);
  }
});

Template.video_post_body.helpers({
  isReady: function() {
    return Template.instance().isReady.get();
  }
});
