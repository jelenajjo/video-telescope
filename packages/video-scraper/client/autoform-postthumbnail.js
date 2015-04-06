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
  }
});
