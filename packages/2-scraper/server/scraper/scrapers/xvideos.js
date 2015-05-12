var cheerio = Npm.require('cheerio');

var mobileUserAgent = 'Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) ' +
                      'AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 ' +
                      'Safari/535.19';

var XVideo = function(url) {
  this.url = url;

  try {
    this.content = HTTP.get(url, {
				'headers': {
          'Host': 'www.xvideos.com',
					'User-Agent': mobileUserAgent
				}
    }).content;

    this.$ = cheerio.load(this.content);
  } catch (error) {
    console.log(error);
    throw error;
    //throw new Meteor.Error(errorObject.error_code, errorObject.error_message);
  }
};

XVideo.prototype._normalizeUrl = function(url) {
	return url.replace(/ |\'/g,'');
};

XVideo.prototype._getTitleAndDesctiption = function() {
  return {
    title: this.$('title').text(),
    description: this.$('meta[name=description]').attr('content')
  };
};

XVideo.prototype._getVideoAndThumbnailUrl = function() {
	var split = this.content.split('mobileReplacePlayerDivTwoQual(');
	split = split[1];
	split = split.split(');');
	split = split[0];
	split = split.split(',');

  return {
    videoUrl: this._normalizeUrl(split[2]) || this._normalizeUrl(split[1]),
    thumbnailUrl: this._normalizeUrl(split[3])
  };
};

XVideo.prototype.getData = function() {
  var data = this._getTitleAndDesctiption();
  _.extend(data, this._getVideoAndThumbnailUrl());
  return data;
};

Scraper.xvideos = function(url) {
  var ins = new XVideo(url);
  return ins.getData();
};
