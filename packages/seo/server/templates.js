SSR.compileTemplate('css',Assets.getText('private/views/common/css.html'));

SSR.compileTemplate('layout',Assets.getText('private/views/common/layout.html'));

SSR.compileTemplate('openGraph',Assets.getText('private/views/common/open-graph.html'));

SSR.compileTemplate('noindex',Assets.getText('private/views/noindex.html'));

SSR.compileTemplate('main',Assets.getText('private/views/main.html'));
Template.main.helpers({
  doctype:function(){
    return '<!DOCTYPE html>';
  },
  faviconUrl:function(){
    return Settings.get('faviconUrl', '/img/favicon.ico');
  }
});

SSR.compileTemplate('nav',Assets.getText('private/views/nav/nav.html'));
Template.nav.helpers({
  logoUrl:function(){
    return Settings.get('logoUrl');
  },
  siteTitle:function(){
    return Settings.get('title', 'the-sex.com');
  }
});

SSR.compileTemplate('postAuthor',Assets.getText('private/views/posts/modules/post-author.html'));
Template.postAuthor.helpers({
  profileUrl:function(userId){
    return getProfileUrlBySlugOrId(userId);
  },
  displayName:function(userId){
    return getDisplayNameById(userId);
  }
});

SSR.compileTemplate('postContent',Assets.getText('private/views/posts/modules/post-content.html'));

SSR.compileTemplate('postInfo',Assets.getText('private/views/posts/modules/post-info.html'));
Template.postInfo.helpers({
  timeAgo:function(datetime){
    return moment(datetime).fromNow();
  }
});

SSR.compileTemplate('postBody',Assets.getText('private/views/posts/post-body.html'));
SSR.compileTemplate('postItem',Assets.getText('private/views/posts/post-item.html'));

SSR.compileTemplate('postPage',Assets.getText('private/views/posts/post-page.html'));
