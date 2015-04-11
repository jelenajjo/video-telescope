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
  });
});
