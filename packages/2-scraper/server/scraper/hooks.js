var knox = Npm.require('knox');

var parseUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

Meteor.startup(function() {
  Posts.after.remove(function (userId, doc) {
    var credential = {
      'key': Meteor.settings.AWSAccessKeyId,
      'secret': Meteor.settings.AWSSecretAccessKey,
      'bucket': Meteor.settings.S3bucket
    };

    var s3 = knox.createClient(credential);
    var path;

    if (doc.videoLocation === 's3' && doc.videoUrl) {
      path = parseUrl.exec(doc.videoUrl)[5];
      s3.del(path).end();
    }

    if (doc.thumbnailUrl) {
      path = parseUrl.exec(doc.thumbnailUrl)[5];
      s3.del(path).end();
    }

    _.each(Posts.images(doc), function(i) {
      path = parseUrl.exec(i)[5];
      s3.del(path).end();
    });
  });

  Posts.before.update(function (userId, doc, fieldNames, modifier) {
    if (_.indexOf(fieldNames, 'imageUrls') === -1) {
      return;
    }

    var credential = {
      'key': Meteor.settings.AWSAccessKeyId,
      'secret': Meteor.settings.AWSSecretAccessKey,
      'bucket': Meteor.settings.S3bucket
    };

    var s3 = knox.createClient(credential);
    var path;

    var oldImages = Posts.images(doc);
    var newImages = Posts.images(modifier.$set) || [];

    if (modifier.$unset && modifier.$unset.imageUrls) {
      newImages = [];
    }

    _.each(_.difference(oldImages, newImages), function(i) {
      path = parseUrl.exec(i)[5];
      s3.del(path).end();
    });
  });
});
