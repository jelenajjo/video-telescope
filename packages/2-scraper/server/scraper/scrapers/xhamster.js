var cheerio = Npm.require('cheerio');

var Xhamster = function(url) {
  this.url = url;

  try {
    this.content = HTTP.get(url).content;

    this.$ = cheerio.load(this.content);
  } catch (error) {
    console.log(error);
    throw error;
    //throw new Meteor.Error(errorObject.error_code, errorObject.error_message);
  }
};

Xhamster.prototype.getData = function() {
  var data = {
    title: this.$('title').text(),
    description: this.$('meta[name=description]').attr('content'),
    videoUrl: this.$('video').attr('file'),
    thumbnailUrl: this.$('video').attr('poster'),
  };

  return data;
};

Scraper.xhamster = function(url) {
  var ins = new Xhamster(url);
  return ins.getData();
};
