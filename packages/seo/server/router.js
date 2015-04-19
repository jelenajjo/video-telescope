var seoPicker = Picker.filter(function(req) {
    return /_escaped_fragment_/.test(req.url);
});

function openGraphMetaProperties(post){
  var og = {
    type: 'video',
    url: Router.routes.post_page_by_slug.url(post),
    title: post.title,
    description: post.body,
    site_name: Settings.get('title'),
  };

  if (post.thumbnailUrl) {
    if(post.thumbnailUrl.indexOf('//')===0){
      post.thumbnailUrl='http:'+post.thumbnailUrl;
    }
    og.image = post.thumbnailUrl;
  }

  return og;
}

seoPicker.route('/p/:slug', function(params, req, res) {
  var post=Posts.findOne({slug: params.slug});
  if (!post) {
    res.writeHead(404,  {
      "Content-Type": "text/html; charset=UTF-8"
    });
    res.end('Not found.');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=UTF-8'
  });

  var dataContext=_.extend(post,{
    og:openGraphMetaProperties(post),
    yield:'postPage'
  });
  var html = SSR.render('main', dataContext);

  res.end(html);
});
