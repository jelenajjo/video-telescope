AutoForm.addInputType("bootstrap-postimages", {
  template: "afPostImages"
});

Template.afPostImages.helpers({
  atts: function() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  }
});

Template.afPostImages.events({
  'click .upload-images': function(e) {
    e.preventDefault();
    var $elm = $(e.currentTarget);

    var uploader = new Slingshot.Upload('uploadImages');
    var imageFiles = document.getElementById('post-images-file-input').files;
    if (!imageFiles || imageFiles.length === 0) {
      return alert('Please select image');
    }

    $elm.text('Uploading...');
    $elm.prop('disabled', 'd');
    var doneCount = 0;

    var uploadFn = function(i) {
      var f = imageFiles[i];
      if (!f) { return; }

      uploader.send(f, function(err, url) {
        if (err) {
          console.log(err);
          alert(err);
        } else {
          var images = $('.post-images-input').val();
          if (images) {
            images += '|';
          }
          images += url;

          $('.post-images-input').val(images);
        }

        doneCount += 1;
        if (doneCount === imageFiles.length) {
          $elm.text('Upload');
          $elm.removeProp('disabled');
        } else { uploadFn(doneCount); }
      });
    };

    uploadFn(doneCount);
  }
});
