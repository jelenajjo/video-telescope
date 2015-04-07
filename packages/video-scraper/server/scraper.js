/* global Scraper: true */

var cheerio = Npm.require('cheerio');

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
  }
});
