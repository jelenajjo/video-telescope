var cheerio = Npm.require('cheerio');

Meteor.methods({
  scarperGetData: function(url) {
    check(url, String);

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
});
