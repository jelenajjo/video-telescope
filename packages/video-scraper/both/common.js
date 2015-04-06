var thumbnailProperty = {
  propertyName: 'thumbnailUrl',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      editable: true,
      type: 'bootstrap-postthumbnail'
    }
  }
};
addToPostSchema.push(thumbnailProperty);

var videoProperty = {
  propertyName: 'videoUrl',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      editable: true,
      type: 'bootstrap-postvideo'
    }
  }
};
addToPostSchema.push(videoProperty);

postThumbnail.push({
  template: 'postThumbnail',
  order: 15
});

// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
postClassCallbacks.push(function (post, postClass){
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
});
