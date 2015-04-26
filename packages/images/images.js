var imagesProperty = {
  propertyName: 'images',
  propertySchema: {
    type: [String],
    optional: true,
    autoform: {
      editable: true,
      //type: 'bootstrap-postimages',
    }
  }
};

addToPostSchema.push(imagesProperty);
