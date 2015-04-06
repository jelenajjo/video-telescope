var fillData = function (instance) {
  // note: the following fields are *not* in the current template
  var $urlField = instance.$('[name="url"]');
  var $titleField = instance.$('[name="title"]');
  var $bodyField = instance.$('[name="body"]');
  var url = $urlField.val();

  var $thumbnailContainer = instance.$('.post-thumbnail-container');
  var $videoContainer = instance.$('.post-video-container');
  var $img = instance.$('.post-thumbnail-preview');
  var $video = instance.$('.post-video-preview');
  var $thumbnailUrlField = instance.$('[name="thumbnailUrl"]');
  var $videoUrlField = instance.$('[name="videoUrl"]');

  if (!!url) {
    $thumbnailContainer.addClass('loading');
    $videoContainer.addClass('loading');

    Messages.clearSeen();
    console.log('getting data for '+url);

    Meteor.call('scarperGetData', url, function (error, data) {
      if (error) {
        console.log(error);
        Messages.flash(error.message, 'error');
      } else if (data) {
        // set thumbnail and fill in thumbnailUrl field
        $img.attr('src', data.thumbnailUrl);
        $thumbnailUrlField.val(data.thumbnailUrl);

        // set video and fill in videoUrl field
        $video.attr('src', data.videoUrl);
        $videoUrlField.val(data.videoUrl);

        // remove loading class
        $thumbnailContainer.removeClass('loading');
        $videoContainer.removeClass('loading');

        if (!$titleField.val()) { // if title field is empty, fill in title
          $titleField.val(data.title);
        }
        if (!$bodyField.val()) { // if body field is empty, fill in body
          $bodyField.val(data.description);
        }
      }

      $thumbnailContainer.removeClass('loading');
      $videoContainer.removeClass('loading');
    });
  }
};

Meteor.startup(function() {
  Template[getTemplate('post_submit')].onRendered(function(){
    alert('dfasdfasf');
    var instance = this;
    var $urlField = $('[name="url"]');

    $urlField.change(function (e) {
      e.preventDefault();
      fillData(instance);
    });
  });
});
