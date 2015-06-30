Slingshot.createDirective('uploadThumbnail', Slingshot.S3Storage, {
  bucket: Meteor.settings.S3bucket,
  acl: 'public-read',
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited)

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = 'Please login before posting files';
      throw new Meteor.Error('Login Required', message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    var user = Meteor.users.findOne(this.userId);
    return user.username + '/' + Random.id() + file.name;
  }
});

Slingshot.createDirective('uploadImages', Slingshot.S3Storage, {
  bucket: Meteor.settings.S3bucket,
  acl: 'public-read',
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
  maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited)

  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = 'Please login before posting files';
      throw new Meteor.Error('Login Required', message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    var user = Meteor.users.findOne(this.userId);
    return 'images/' + user.username + '/' + Random.id() + file.name;
  }
});
