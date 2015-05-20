var knox = Npm.require('knox');
var gm = Npm.require('gm').subClass({ imageMagick: true });

var parseUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

var credential = {
  'key': Meteor.settings.AWSAccessKeyId,
  'secret': Meteor.settings.AWSSecretAccessKey,
  'bucket': Meteor.settings.S3bucket
};

var s3 = knox.createClient(credential);

var parseSize = function(size) {
  var slice = size.split('x');
  return {w: Number(slice[0]), h: Number(slice[1])};
};

var cropImage = function(imageUrl, size, cb) {
  try {
    size = parseSize(size);

    var req = HTTP.get(imageUrl, {responseType: 'buffer'}).content;

    gm(req, 'img')
      .resize(size.w, size.h, '^')
      .noProfile()
      .gravity('Center')
      .crop(size.w, size.h)
      .identify(function(err, val) {
        var format = null;
        if (val && val.format) {
          format = val.format.toLowerCase();
        }
        this.write('/tmp/thumbnail', function(err) {
          if (err) {
            throw err;
          } else if (cb) {
            cb(null, {path: '/tmp/thumbnail', format: format});
          }
        });
      });
  } catch (e) {
    cb(e);
  }
};

cropImage =  Meteor.wrapAsync(cropImage);

var uploadImage = function(image, cb) {
  try {
    var headers = {
      'x-amz-acl': 'public-read',
      'Content-Type': 'image/' + image.format || 'png',
      'region': 'us-west-2'//'us-east-1',
    };

    var path = 'thumbnails/' + Random.id() + '.' + image.format || 'png';
    s3.putFile(image.path, path, headers, function(err, res) {
      if (err) {
        throw err;
      } else {
        cb(null, res.req.url);
      }
    });
  } catch (e) {
    cb(e);
  }
};

uploadImage =  Meteor.wrapAsync(uploadImage);

var removeThumbs = function(post) {
  try {
    var path;

    if (!post.croppedImages) {
      return;
    }

    post.croppedImages.forEach(function(i) {
      path = parseUrl.exec(i.url)[5];
      if (path) {
        s3.del(path).end();
      }
    });
  } catch (e) {
    console.log(e);
  }
};

// Create thumbs submitted or edited
var cropThumbnail = function (post) {
  try {
    var imageUrl = post.thumbnailUrl;
    var croppedImages = [];

    if (!/^https?:\/\//.test(imageUrl)) {
      return false;
    }

    var sizes = Settings.get('allowedImageSizes') || '';
    sizes = sizes.split(',');

    if (sizes.length === 0) {
      return;
    }

    sizes.forEach(function(size) {
      size = size.trim();
      if (Cropper.getCroppedUrl(post, imageUrl, size)) {
        return true;
      }

      try {
        var image = cropImage(imageUrl, size);
        var obj = {
          url: uploadImage(image),
          key: imageUrl + size
        };
        croppedImages.push(obj);

      } catch (e) {
        console.log('Error: ', e);
      }
    });

    if (croppedImages.length > 0) {
      Posts.update(post._id, {$set: {croppedImages: croppedImages}});
    }
  } catch (e) {
    console.log(e);
  }
};
Telescope.callbacks.add("postSubmitAsync", cropThumbnail);

Telescope.callbacks.add("postEditAsync", function(modifier, post) {
  var newThumbnailUrl = modifier.$set && modifier.$set.thumbnailUrl;

  if (newThumbnailUrl !== post.thumbnailUrl) {
    removeThumbs(post);
  }

  post.thumbnailUrl = newThumbnailUrl;
  cropThumbnail(post);
});

Meteor.startup(function() {
  Posts.after.remove(function (userId, doc) {
    removeThumbs(doc);
  });
});
