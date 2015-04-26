AutoForm.addInputType("bootstrap-postimages", {
  template: "afPostImages"
});

Template.afPostImages.helpers({
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
  'click .upload-image': function(e) {
    e.preventDefault();

    var uploader = new Slingshot.Upload('uploadThumbnail');
    var imageFiles = document.getElementById('post-thumbnail-file-input').files;
    if (!imageFiles || imageFiles.length === 0) {
      return alert('Please select image');
    }

    uploader.send(imageFiles[0], function(err, url) {
      if (err) {
        console.log(err);
        return alert(err);
      }
    });
  }
});
