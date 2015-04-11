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

var originUrlProperty = {
  propertyName: 'originUrl',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      type: 'hidden'
    }
  }
};
addToPostSchema.push(originUrlProperty);

var videoLocationProperty = {
  propertyName: 'videoLocation',
  propertySchema: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
};
addToPostSchema.push(videoLocationProperty);

var videoUrlUpdatedAtProperty = {
  propertyName: 'videoUrlUpdatedAt',
  propertySchema: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  }
};
addToPostSchema.push(videoUrlUpdatedAtProperty);

var videoPlayLocationProperty = {
  propertyName: 'videoPlayLocation',
  allowed: ['s3', 'remote'],
  propertySchema: {
    type: String,
    autoform: {
      options: {s3: 's3', remote: 'remote'}
    }
  }
};
addToPostSchema.push(videoPlayLocationProperty);

postThumbnail.push({
  template: 'postThumbnail',
  order: 15
});

// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
postClassCallbacks.push(function (post, postClass){
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
});

templates.post_body = 'video_post_body';
