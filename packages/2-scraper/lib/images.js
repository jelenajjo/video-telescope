Posts.addField({
  fieldName: 'imageUrls',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      editable: true,
      type: 'bootstrap-postimages'
    }
  }
});

Posts.images = function(post) {
  var images = [];
  if (post.imageUrls) {
    _.each(post.imageUrls.split('|'), function(url) {
      url = url.trim();
      if (url) { images.push(url); }
    });
  }

  post._images = images.length > 0 ? images : null;
  return post._images;
};

Posts.helpers({images: function () { return Posts.images(this); }});
