var slugify = function (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-\/]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/\/\/+/g, '/')      // Replace multiple / with single /
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/[\-\/]+$/, '');         // Trim -,/ from end of text
};

var generateSlug = function(title) {
  var slug = slugify(title);
  var temp = 2, oldSlug = slug;

  while (Posts.find({slug: slug}).count() > 0) {
    slug = oldSlug + '-' + temp;
    temp++;
  }

  return slug;
};

postSubmitMethodCallbacks.push(function (post) {
  post.slug = generateSlug(post.title);
  return post;
});
