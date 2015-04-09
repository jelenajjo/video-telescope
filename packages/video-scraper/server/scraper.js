/* global Scraper: true */

var cheerio = Npm.require('cheerio');
var request = Npm.require('request');
var knox = Npm.require('knox');

// Download video after post sumbimmeted
var downloadVideoAfterSubmit = function (post) {
  /*post = {
    _id: Random.id(),
    //videoUrl: 'http://videos1.cdn.xvideos.com/videos/3gp/7/9/e/xvideos.com_79e200b9438163c79eb60735ff8bc103.mp4?e=1428575944&ri=1024&rs=85&h=0678a0432903d435974aa71ff85df039'
    videoUrl: 'http://content.xvideos.com/videos/mp4/9/7/b/xvideos.com_97bcd7e8a94a610385bdb2641474dbc7.mp4?e=1428576794&ri=1024&rs=85&h=332e376c5fed4e41a325810ecc0dd92e'
  };*/

  var s3 = knox.createClient(Meteor.settings.S3);

  if (!post.videoUrl) {
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
    request(post.videoUrl).pipe(req);

    req.on('response', Meteor.bindEnvironment(function(res) {
      res.body = '';
      res.on('data', function (chunk) {
        res.body += chunk;
      });

      res.on('end', function () {
        console.log(res.body);
      });

      if (res.statusCode === 200) {
        console.log('saved to', req.url);
        Posts.update(post._id, {$set: {videoUrl: req.url}});
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
postAfterSubmitMethodCallbacks.push(downloadVideoAfterSubmit);

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

var getData = function(url) {
  var data;

  if (/^http:\/\/www\.xvideos\.com/.test(url)) {
    data = Scraper.xvideos(url);
  } else {
    data = Scraper.general(url);
  }

  return data;
};

Meteor.methods({
  scraperGetData: function(url) {
    check(url, String);

    return getData(url);
  },
  testDownload: function() {
    downloadVideoAfterSubmit();
  }
});
