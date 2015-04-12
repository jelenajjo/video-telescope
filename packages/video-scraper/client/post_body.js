Template.video_post_body.onRendered(function() {
  var data = Template.currentData();

  if (!data.originUrl || !data.videoLocation || data.videoLocation === 's3') {
    return;
  }

  Meteor.call('updateVideoUrl', data._id, function (error) {
    if (error) {
      console.log(error);
    }
    return;
  });
});
