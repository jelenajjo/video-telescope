// Publish a single post

Meteor.publish('singlePostBySlug', function(slug) {
  if (can.viewById(this.userId)){
    return Posts.find({slug: slug});
  }
  return [];
});

// Publish author of the current post, authors of its comments, and upvoters of the post

Meteor.publish('postUsersBySlug', function(postSlug) {
  if (can.viewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne({slug: postSlug}),
        users = [post.userId]; // publish post author's ID

    if (post) {

      // get IDs from all commenters on the post
      var comments = Comments.find({postId: post._id}).fetch();
      if (comments.length) {
        users = users.concat(_.pluck(comments, "userId"));
      }

      // publish upvoters
      if (post.upvoters && post.upvoters.length) {
        users = users.concat(post.upvoters);
      }

      // publish downvoters
      if (post.downvoters && post.downvoters.length) {
        users = users.concat(post.downvoters);
      }

    }

    // remove any duplicate IDs
    users = _.unique(users);

    return Meteor.users.find({_id: {$in: users}}, {fields: privacyOptions});
  }
  return [];
});

// Publish comments for a specific post

Meteor.publish('postCommentsBySlug', function(postSlug) {
  if (can.viewById(this.userId)){
    var post = Posts.findOne({slug: postSlug});
    if (post) {
      return Comments.find({postId: post._id}, {sort: {score: -1, postedAt: -1}});
    }
  }
  return [];
});
