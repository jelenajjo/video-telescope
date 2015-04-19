var seoPicker = Picker.filter(function(req) {
    return /_escaped_fragment_/.test(req.url);
});

seoPicker.route('/', function(params, req, res) {
  var posts = Posts.find();
  res.end('Hello from server');
  return;

  var html = SSR.render('layout', {
    //css: css,
    template: "home",
    data: {posts: posts}
  });

  res.end(html);
});
