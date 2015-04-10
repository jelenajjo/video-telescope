var updateVideoUrl = function () {
  SyncedCron.add({
    name: 'Update videos url',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    },
    job: function() {
      var cursor = Posts.find();
      cursor.forEach(function(p) {
        if (!p.videoUrl || p.videoLocation === 's3' || !p.originUrl) {
          return;
        }

        try {
          var data = scrapeData(p.originUrl);
          if (!data.videoUrl) {
            return;
          }

          clog('Fetched new url on "' + p.title + '"URL: ' + data.videoUrl);
          Posts.update(p._id, {$set: {videoUrl: data.videoUrl}});
        } catch (e) {
          clog(e);
          return true;
        }
      });
    }
  });
};

Meteor.startup(function () {
  updateVideoUrl();
});
