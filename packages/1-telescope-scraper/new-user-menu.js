Template[getTemplate('newUserMenu')].helpers({
  currentUser: function () {
    return Meteor.user();
  },
  menuLabel: function () {
    return getDisplayName(Meteor.user());
  },
  menuItems: function () {
    return userMenu;
  },
  menuMode: function () {
    if (!!this.mobile) {
      return 'list';
    } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
      return 'dropdown';
    }
  }
});