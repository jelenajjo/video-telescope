var slugify = function (text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
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

Telescope.callbacks.register('postSubmit', function (post) {
  post.slug = generateSlug(post.title);
  return post;
});

Telescope.callbacks.register('postEdit', function(modifier, post) {
  var newTitle = modifier.$set && modifier.$set.title;

  if (newTitle !== post.title) {
    var slug = generateSlug(newTitle, post._id);
    modifier.$set.slug = slug;
  }

  return modifier;
});


/******* Publications *************/

// Publish a single post

Meteor.publish('singlePostBySlug', function(slug) {
  if (Users.can.viewById(this.userId)){
    return Posts.find({slug: slug});
  }
  return [];
});

// Publish author of the current post, authors of its comments, and upvoters of the post

Meteor.publish('postUsersBySlug', function(postSlug) {
  if (Users.can.viewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne({slug: postSlug});

    if (!post) {
      return this.ready();
    }

    var users = [post.userId]; // publish post author's ID
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

    // remove any duplicate IDs
    users = _.unique(users);

    return Meteor.users.find({_id: {$in: users}}, {fields: Users.pubsub.publicProperties});
  }
  return [];
});

// Publish a list of comments

Meteor.publish('commentsListBySlug', function(terms) {
  if(Users.can.viewById(this.userId)){
    var parameters = Comments.getSubParams(terms);
    var comments = Comments.find(parameters.find, parameters.options);

    // if there are comments, find out which posts were commented on
    var commentedPostIds = comments.count() ? _.pluck(comments.fetch(), 'postId') : [];
    return [
      comments,
      Posts.find({_id: {$in: commentedPostIds}})
    ];
  }
});
