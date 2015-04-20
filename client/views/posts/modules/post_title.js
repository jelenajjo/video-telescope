Template[getTemplate('postTitle')].helpers({
  postLink: function(){
    //return !!this.url ? getOutgoingUrl(this.url) : "/posts/"+this._id;
    if (this.slug) {
      return "/p/"+this.slug;
    } else {
      return "/posts/"+this._id;
    }
  },
  postTarget: function() {
    return !!this.url ? '_blank' : '';
  }
});
