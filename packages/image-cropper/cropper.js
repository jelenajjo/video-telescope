/* global Cropper: true */

var imagesProperty = {
  propertyName: 'croppedImages',
  propertySchema: {
    type: [Object],
    optional: true,
    autoform: {
      editable: false,
      omit: true
    }
  }
};

addToPostSchema.push(imagesProperty);

addToPostSchema.push({
  propertyName: 'croppedImages.$.key',
  propertySchema: {
    type: String
  }
});

addToPostSchema.push({
  propertyName: 'croppedImages.$.url',
  propertySchema: {
    type: String
  }
});

var allowedSizesProperty = {
  propertyName: 'allowedImageSizes',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'image crop',
      instructions: 'Example: 150x200, 200x250',
      private: true
    }
  }
};
Settings.addToSchema(allowedSizesProperty);

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
