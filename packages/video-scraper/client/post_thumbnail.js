Template[getTemplate('postThumbnail')].helpers({
  postLink: function () {
    return !!this.url ? getOutgoingUrl(this.url) : "/posts/"+this._id;
  },
  playVideoClass: function () {
    return !!this.videoUrl ? 'post-thumbnail-has-video': '';
  }
});
