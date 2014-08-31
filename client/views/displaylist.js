Template.displaylist.events({
  'click #startScoringButton': function(e) {
    e.preventDefault();
    var list = this.list;
    //if we have a user => just go to scoring
    if(Meteor.user()) {
      addParticipantToList(list._id);
      Router.go('scoring', {listHash: list.hash, itemOrder: 1});
      return;
    }
    //else we need to create the user on the spot
    var userName = $('#newUserNameInput').val();
    if(!userName) {
      throwError('Sorry, anonymous scoring is not allowed!');
      return;
    }
    Accounts.createUser(
      {
        username: userName,
        password: Meteor.uuid()
      },
      function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        addParticipantToList(list._id);
        Router.go('scoring', {listHash: list.hash, itemOrder: 1});
      }
    });
  }
});

var addParticipantToList = function(listId) {
  var user = Meteor.user();
  var already = Listparticipants.findOne({
    list: listId,
    user: user._id
  });
  if(already) return;
  Listparticipants.insert({
    list: listId,
    user: user._id,
    username: user.username
  },function(error){
    if(error) {
      throwError(error.reason)
    }
  });
}
