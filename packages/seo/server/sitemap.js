/*
 * http://en.wikipedia.org/wiki/Site_map
 * http://www.sitemaps.org/index.html
 */

sitemaps = {
  list: {}
};

if (typeof Number.lpad === "undefined") {
  Number.prototype.lpad = function(length) {
    "use strict";
    var str = this.toString();
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  };
}

var urlStart = Meteor.absoluteUrl();
function prepareUrl(url) {
  if (!/^https?:\/\//.test(url)) {
    return urlStart + escape(url.replace(/^\//, ''));
  }
  return escape(url).replace('http%3A', 'http:').replace('https%3A', 'https:');
}

// TODO: 1) gzip, 2) sitemap index + other types + sitemap for old content
var Fiber = Npm.require('fibers');
WebApp.connectHandlers.use(function(req, res, next) {
  new Fiber(function() {
    "use strict";
    var out, pages, urls;

    urls = _.keys(sitemaps.list);
    if (!_.contains(urls, req.url))
      return next();

    pages = sitemaps.list[req.url];
    if (_.isFunction(pages))
      pages = pages();
    else if (!_.isArray(pages))
      throw new TypeError("sitemaps.add() expects an array or function");

    // The header is added later once we know which namespaces we need
    out = '';
    var namespaces = {};

    var w3cDateTimeTS, date;
    _.each(pages, function(page) {

      out += '  <url>\n'
        + '    <loc>' + prepareUrl(page.page) + '</loc>\n';

      if (page.lastmod) {
        date = new Date(page.lastmod);
        w3cDateTimeTS = date.getUTCFullYear() + '-'
          + (date.getUTCMonth()+1).lpad(2) + '-'
          + date.getUTCDate().lpad(2) + 'T'
          + date.getUTCHours().lpad(2) + ':'
          + date.getUTCMinutes().lpad(2) + ':'
          + date.getUTCSeconds().lpad(2) + '+00:00';
        out += '    <lastmod>' + w3cDateTimeTS + '</lastmod>\n';
      }

      if (page.changefreq)
        out += '    <changefreq>' + page.changefreq + '</changefreq>\n';

      if (page.priority)
        out += '    <priority>' + page.priority + '</priority>\n';

      if (page.xhtmlLinks) {
        namespaces.xhtml = true;
        if (!_.isArray(page.xhtmlLinks))
          page.xhtmlLinks = [page.xhtmlLinks];
        _.each(page.xhtmlLinks, function(link) {
          out += '    <xhtml:link \n';
          if (link.href)
            link.href = prepareUrl(link.href);
          for (var key in link)
            out += '      ' + key + '="' + link[key] + '"\n';
          out += '      />\n';
        });
      }

      _.each(['image', 'video'], function(tag) {
        var tagS = tag+'s';
        if (page[tagS]) {
          namespaces[tag] = true;
          if (!_.isArray(page[tagS]))
            page[tagS] = [page[tagS]];

          _.each(page[tagS], function(data) {
            out += '      <'+tag+':'+tag+'> \n';

            for (var key in data) {
              if (key === 'loc' || key.match(/_loc$/))
                data[key] = prepareUrl(data[key]);
              out += '        <'+tag+':'+key+'>' + data[key] + '</'+tag+':'+key+'>\n';
            }

            out += '      </'+tag+':'+tag+'> \n';
          });
        }
      });

      out  += '   </url>\n\n';
    });

    out += '</urlset>\n';

    // We do this last so we know which namesapces to add
    var header = '<?xml version="1.0" encoding="UTF-8"?>\n'
      + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

    if (namespaces.xhtml)
      header += '\n  xmlns:xhtml="http://www.w3.org/1999/xhtml"';
    if (namespaces.image)
      header += '\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
    if (namespaces.video)
      header += '\n  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"';
    header += '>\n';

    out = header + out;

    res.writeHead(200, {'Content-Type': 'application/xml'});
    res.end(out, 'utf8');
    return;
  }).run();
});

sitemaps.add = function(url, func) {
  "use strict";
  check(url, String);

  sitemaps.list[url] = func;
};

/*
sitemaps.add('/sitemap.xml', function() {
  // 'page' is reqired
  // 'lastmod', 'changefreq', 'priority' are optional.
  return [
    { page: 'x', lastmod: new Date().getTime() },
    { page: 'y', lastmod: new Date().getTime(), changefreq: 'monthly' },
    { page: 'z', lastmod: new Date().getTime(), changefreq: 'monthly', priority: 0.8 }
  ];
});
*/

Meteor.startup(function() {
  /*
   * Sitemap
   */
  sitemaps.add("/sitemap.xml", function() {
    var _getLatest = function(viewParamKey, terms) {
      var params = Posts.getSubParams(
        Posts.views[viewParamKey.toLowerCase()](terms)
      );
      var post = Posts.findOne(params.find, {
        'fields': {'postedAt': 1},
        'sort': params.options.sort
      });
      return post ? post.postedAt : null;
    };

    // Posts list pages
    var paths = [
      {page: "/", lastmod: _getLatest(Settings.get("defaultView", "top")), changefreq: "hourly"}
    ];

    // Individual post pages: include 100 latest in each of "top", "new", and
    // "best". Aggregate them to avoid duplication.
    var postPages = {};
    _.each(["top", "new", "best"], function(key) {
      var params = Posts.getSubParams(Posts.views[key]());
      var posts = Posts.find(params.find, {
        limit: 100,
        sort: params.options.sort
      });
      posts.forEach(function(post) {
        var url = '/p/'+post.slug;
        postPages[url] = {page: url, lastmod: post.postedAt, changefreq: "daily"};

        var date = post.createdAt;
        var w3cDateTimeTS = date.getUTCFullYear() + '-' +
         (date.getUTCMonth()+1).lpad(2) + '-' +
         date.getUTCDate().lpad(2) + 'T' +
         date.getUTCHours().lpad(2) + ':' +
         date.getUTCMinutes().lpad(2) + ':' +
         date.getUTCSeconds().lpad(2) + '+00:00';

        if (post.videoUrl) {
          postPages[url].videos = [{
            content_loc: post.videoUrl,
            thumbnail_loc: post.thumbnailUrl,
            title: post.title,
            description: post.body,
            publication_date: w3cDateTimeTS,
            view_count: post.viewCount,
            tag: _.map(getPostCategories(post), function(p) {
              return '"' + p.name + '"';
            }).join(', ')
          }];
        }
      });
    });

    paths = paths.concat(_.values(postPages));
    paths = _.reject(paths, function(p) { return p.lastmod === null;});
    return paths;
  });
});
