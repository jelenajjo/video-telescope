var slugify = function (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-\/]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/\/\/+/g, '/')      // Replace multiple / with single /
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/[\-\/]+$/, '');         // Trim -,/ from end of text
};

var generateSlug = function(title, postId) {
  var slug = slugify(title);
  var temp = 2, oldSlug = slug;

  while (Posts.find({slug: slug, _id: {$ne: postId}}).count() > 0) {
    slug = oldSlug + '-' + temp;
    temp++;
  }

  return slug;
};

postSubmitMethodCallbacks.push(function (post) {
  post.slug = generateSlug(post.title);
  return post;
});

postEditMethodCallbacks.push(function(modifier, post) {
  var newTitle = modifier.$set && modifier.$set.title;

  if (newTitle !== post.title) {
    var slug = generateSlug(newTitle, post._id);
    modifier.$set.slug = slug;
  }

  return modifier;
});
