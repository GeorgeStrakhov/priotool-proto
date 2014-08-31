Template.buildlist.events({
  'submit form': function(e) {
    e.preventDefault();
    var newList = {};
    newList.hash = $('#inputHash').val();
    newList.name = $('#inputListName').val();
    newList.description = $('#inputListDescription').val();
    Meteor.call('createNewUserList', newList, function(error, result){
      if(error) {
        throwError(error.reason);
        return;
      }
      if(result && result.newListId) {
        //go to editing new list
        Router.go('editlist', {listHash: result.hash});
      }
    });
  }
});
