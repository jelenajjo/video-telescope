AutoForm.addInputType("bootstrap-postvideo", {
  template: "afPostVideo"
});

Template.afPostVideo.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  },
  style: function () {
    return;
  }
});

Template.afPostVideo.events({
  'change .post-video-input': function(e) {
    e.preventDefault();

    var link = $(e.currentTarget).val();
    $('video.post-video-preview').attr('src', link);
  }
});
