AutoForm.addInputType("bootstrap-postthumbnail", {
  template: "afPostThumbnail"
});

Template.afPostThumbnail.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  },
  style: function () {
    var thumbnailWidth = 200;
    var thumbnailHeight = 125;
    return "width: "+thumbnailWidth+"px; height: "+thumbnailHeight+"px;";
  }
});

Template.afPostThumbnail.events({
  'change .post-thumbnail-input': function(e) {
    e.preventDefault();

    var link = $(e.currentTarget).val();
    $('img.post-thumbnail-preview').attr('src', link);
  },
  'click .upload-image': function(e) {
    e.preventDefault();

    var uploader = new Slingshot.Upload('uploadThumbnail');
    var imageFiles = document.getElementById('post-thumbnail-file-input').files;
    if (!imageFiles || imageFiles.length === 0) {
      return alert('Please select image');
    }

    var $thumbnailContainer = $('.post-thumbnail-container');
    $thumbnailContainer.addClass('loading');

    uploader.send(imageFiles[0], function(err, url) {
      $thumbnailContainer.removeClass('loading');
      if (err) {
        console.log(err);
        return alert(err);
      }
      $('.post-thumbnail-input').val(url);
      $('.post-thumbnail-preview').attr('src', url);
    });
  }
});
