/* global Cropper: true */

Posts.addField({
  fieldName: 'croppedImages',
  fieldSchema: {
    type: [Object],
    optional: true,
    autoform: {
      editable: false,
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'croppedImages.$.key',
  fieldSchema: {
    type: String
  }
});

Posts.addField({
  fieldName: 'croppedImages.$.url',
  fieldSchema: {
    type: String
  }
});

Settings.addField({
  fieldName: 'allowedImageSizes',
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'image crop',
      instructions: 'Example: 150x200, 200x250',
      private: true
    }
  }
});

Cropper = {
  getCroppedUrl: function(post, imageUrl, size) {
    if (post.croppedImages) {
      var img = _.find(post.croppedImages, function(i) {
        return i.key === imageUrl + size;
      });

      if (img) {
        return img.url;
      }
    }
  }
};
