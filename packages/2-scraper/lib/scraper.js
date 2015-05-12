Posts.registerField({
  fieldName: 'videoUrl',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      editable: true,
      type: 'bootstrap-postvideo'
    }
  }
});

Posts.registerField({
  fieldName: 'thumbnailUrl',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      editable: true,
      type: 'bootstrap-postthumbnail'
    }
  }
});

Posts.registerField({
  fieldName: 'originUrl',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      editable: true,
      type: 'hidden'
    }
  }
});

Posts.registerField({
  fieldName: 'videoLocation',
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.registerField({
  fieldName: 'videoUrlUpdatedAt',
  fieldSchema: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.registerField({
  fieldName: 'videoPlayLocation',
  allowed: ['s3', 'remote'],
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      options: {s3: 's3', remote: 'remote'}
    }
  }
});

Telescope.modules.register("postThumbnail", {
  template: 'postThumbnail',
  order: 15
});

// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
Telescope.callbacks.register("postClass", function (post, postClass){
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
});
