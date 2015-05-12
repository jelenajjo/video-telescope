Template.postBottom.helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  post_body: function () {
    return getTemplate('post_body');
  },
  comment_form: function () {
    return getTemplate('comment_form');
  },
  comment_list: function () {
    return getTemplate('comment_list');
  }
});

Template.postBottom.onRendered(function(){
  $('body').scrollTop(0);
});
