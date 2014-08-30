Template.displaylist.events({
  'click #startScoringButton': function(e) {
    e.preventDefault();
    var list = this.list;
    //if we have a user => just go to scoring
    if(Meteor.user()) {
      Router.go('scoring', {listHash: list.hash, itemOrder: 1});
      return;
    }
    //else we need to create the user on the spot
    var userName = $('#newUserNameInput').val();
    if(!userName) {
      throwError('Username can\'t be blank!');
      return;
    }
    Accounts.createUser(
      {
        username: userName,
        password: 'password'
      },
      function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('scoring', {listHash: list.hash, itemOrder: 1});
      }
    });
  }
});
