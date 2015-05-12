Template.post_title.helpers({
  postLink: function() {
    //return !!this.url ? Posts.getOutgoingUrl(this.url) : "/posts/"+this._id;
    if (this.slug) {
      return "/p/"+this.slug;
    } else {
      return "/posts/"+this._id;
    }
  }
});
