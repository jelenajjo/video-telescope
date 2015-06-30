/* global Scraper: true */

var parseUrl = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

var cheerio = Npm.require('cheerio');
var request = Npm.require('request');
var knox = Npm.require('knox');

// Download video after post sumbimmeted or edited
var downloadVideo = function (post) {
  /*
  post = {
    _id: Random.id(),
    videoPlayLocation: 's3',
    //videoUrl: 'http://videos1.cdn.xvideos.com/videos/3gp/7/9/e/xvideos.com_79e200b9438163c79eb60735ff8bc103.mp4?e=1428575944&ri=1024&rs=85&h=0678a0432903d435974aa71ff85df039'
    videoUrl: 'http://content.xvideos.com/videos/mp4/9/7/b/xvideos.com_97bcd7e8a94a610385bdb2641474dbc7.mp4?e=1428576794&ri=1024&rs=85&h=332e376c5fed4e41a325810ecc0dd92e'
    //videoUrl: 'http://vt.tumblr.com/tumblr_mg0kaiY3sn1rtdgjp.mp4'
  };*/

  var credential = {
    'key': Meteor.settings.AWSAccessKeyId,
    'secret': Meteor.settings.AWSSecretAccessKey,
    'bucket': Meteor.settings.S3bucket
  };

  var s3 = knox.createClient(credential);

  if (!post.videoUrl || post.videoPlayLocation !== 's3' ||
      post.videoLocation === 's3') {
    return post;
  }

  request.head(post.videoUrl, Meteor.bindEnvironment(function(err, res) {
    if (err) {
      return;
    }

    var headers = {
      'x-amz-acl': 'public-read',
      'region': 'us-west-2',//'us-east-1',
      'Content-Length': res.headers['content-length'],
      'Content-Type': res.headers['content-type']
    };

    var req = s3.put('videos/'+post._id, headers);
    request(post.videoUrl).on('response', function(res) {
      if (res.headers.date) {
        delete res.headers.date;
      }
      res.pipe(req);
    });

    req.on('response', Meteor.bindEnvironment(function(res) {
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      });

      res.on('end', function () {
        if (res.statusCode !== 200) {
          console.log(res.body);
        }
      });

      if (res.statusCode === 200) {
        //console.log('saved to', req.url);
        Posts.update(post._id, {$set: {videoUrl: req.url, videoLocation: 's3', videoUrlUpdatedAt: new Date()}});
      } else {
        console.log('Error occured. Status code: ', res.statusCode);
      }
    }, function(err) {
      console.log('Failed to bind environment', err, err.track);
    }));

    req.on('error', function(err) {
      console.log('Error', err);
    });
  }, function(err) {
    console.log('Failed to bind environment', err.track);
  }));

  return post;
};
Telescope.callbacks.add("postSubmitAsync", downloadVideo);

Posts.before.update(function (userId, doc, fieldNames, modifier) {
  if (_.indexOf(fieldNames, 'videoUrl') === -1) {
    return;
  }
  var $set = modifier.$set;
  var newVideoUrl = $set && $set.videoUrl;

  if (newVideoUrl !== doc.videoUrl) {
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


    if ($set.videoPlayLocation === 's3') {
      doc.videoUrl = newVideoUrl;
      doc.videoPlayLocation = 's3';
      doc.videoLocation = 'remote';
      downloadVideo(doc);
    }
  }
});

var beforeSubmit = function(post) {
  if (/^http:\/\/www\.xvideos\.com/.test(post.originUrl)) {
    post.videoLocation = 'xvideo';
  } else if (/^http:\/\/\xhamster\.com/.test(post.originUrl)) {
    post.videoLocation = 'xhamster';
  }
  post.videoUrlUpdatedAt = new Date();

  return post;
};
Telescope.callbacks.add("postSubmit", beforeSubmit);

Scraper = {
  general: function(url) {
    var data = {};

    try {
      var content = HTTP.get(url).content;

      var $ = cheerio.load(content);
      data.title = $('title').text();
      data.description = $('meta[name=description]').attr('content');
    } catch (error) {
      console.log(error);
      throw error;
      //throw new Meteor.Error(errorObject.error_code, errorObject.error_message);
    }
    return data;
  }
};

var scrapeData = function(url) {
  var data;

  if (/^http:\/\/www\.xvideos\.com/.test(url)) {
    data = Scraper.xvideos(url);
  } else if (/^http:\/\/\xhamster\.com/.test(url)) {
    data = Scraper.xhamster(url);
  } else {
    data = Scraper.general(url);
  }

  return data;
};

Meteor.methods({
  scraperGetData: function(url) {
    check(url, String);

    try {
      return scrapeData(url);
    } catch (e) {
      return;
    }
  },
  updateVideoUrl: function(id) {
    check(id, String);

    var post = Posts.findOne(id);

    if (!post) {
      return;
    }

    if (!post.originUrl || !post.videoLocation || post.videoLocation === 's3') {
      return;
    }

    if (post.videoLocation === 'xvideo') {
      var diff = Math.abs(new Date() - post.videoUrlUpdatedAt);
      if (diff / 60000 < 40) {
        return;
      }

      var data = scrapeData(post.originUrl);
      if (data.videoUrl) {
        Posts.update(id, {$set: {videoUrl: data.videoUrl, videoUrlUpdatedAt: new Date()}});
      }
    }
  },
  testDownload: function() {
    downloadVideo();
  }
});
