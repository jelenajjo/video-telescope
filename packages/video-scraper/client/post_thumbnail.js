Template[getTemplate('postThumbnail')].helpers({
  postLink: function () {
    return !!this.slug ? "/p/"+this.slug : "/posts/"+this._id;
  },
  playVideoClass: function () {
    return !!this.videoUrl ? 'post-thumbnail-has-video': '';
  }
});
