Comments.views.register("postCommentsBySlug", function (terms) {
  var post = Posts.findOne({slug: terms.slug}, {fields: {_id: 1}});

  terms.postId = null;

  if (post) {
    terms.postId = post._id;
  }

  return {
    find: {postId: terms.postId},
    options: {sort: {score: -1, postedAt: -1}}
  };
});
