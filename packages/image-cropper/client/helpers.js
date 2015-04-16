Template.registerHelper('crop', function(post, imageUrl, size) {
  if (!/^https?:\/\//.test(imageUrl)) {
    return imageUrl;
  }

  var croppedUrl = Cropper.getCroppedUrl(post, imageUrl, size);

  return croppedUrl || imageUrl;
});
