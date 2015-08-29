Posts.addField({
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

Posts.addField({
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

Posts.addField({
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

Posts.addField({
  fieldName: 'videoLocation',
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'videoUrlUpdatedAt',
  fieldSchema: {
    type: Date,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'videoPlayLocation',
  allowed: ['s3', 'remote', 'server'],
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      options: {s3: 's3', remote: 'remote', server: "server"}
    }
  }
});

Telescope.modules.add("postThumbnail", {
  template: 'postThumbnail',
  order: 15
});

// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
Telescope.callbacks.add("postClass", function (post, postClass){
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
});
