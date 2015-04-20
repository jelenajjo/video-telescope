var slugProperty = {
  propertyName: 'slug',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      editable: false,
      omit: true
    }
  }
};

addToPostSchema.push(slugProperty);
