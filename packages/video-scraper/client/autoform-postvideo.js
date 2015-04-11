AutoForm.addInputType("bootstrap-postvideo", {
  template: "afPostVideo"
});

Template.afPostVideo.onRendered(function() {
  var self = this;

  // Get handles on the video and canvas elements
  self.video = document.querySelector('video.post-video-preview');
  //self.video.setAttribute('crossorigin', 'anonymous');
  self.canvas = document.querySelector('canvas.snapshot');

  // Define some vars required later
  var ratio;

  // Add a listener to wait for the 'loadedmetadata' state so the video's dimensions can be read
  self.video.addEventListener('loadedmetadata', function() {
    // Calculate the ratio of the video's width to height
    ratio = self.video.videoWidth / self.video.videoHeight;
    // Define the required width as 100 pixels smaller than the actual video's width
    self.w = self.video.videoWidth;// - 100;
    // Calculate the height based on the video's width and the ratio
    self.h = parseInt(self.w / ratio, 10);
    // Set the canvas width and height to the values just calculated
    self.canvas.width = self.w;
    self.canvas.height = self.h;
  }, false);
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
  },
  'click .take-snapshot': function(e) {
    e.preventDefault();

    var instance = Template.instance();
    var context = instance.canvas.getContext('2d');
    // Define the size of the rectangle that will be filled (basically the entire element)
    context.fillRect(0, 0, instance.w, instance.h);
    // Grab the image from the video
    context.drawImage(instance.video, 0, 0, instance.w, instance.h);
  }
});
