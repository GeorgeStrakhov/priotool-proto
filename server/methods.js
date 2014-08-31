Meteor.methods({
  createNewUserList : function(newListData) {
    if(!this.userId) {
      throw new Meteor.Error(403, 'You are not logged in. Please logged in.'); 
      return;
    }
    var userId = this.userId;
    var result = {};
    if(!newListData.name) {
      throw new Meteor.Error(403, 'List name can\'t be blank.'); 
      return;
    }
    if(!newListData.hash) {
      throw new Meteor.Error(403, 'Please choose a URL');
      return;
    }
    //check if a list with this hash already exists.
    var already = Lists.findOne({hash: newListData.hash});
    if(already) {
      throw new Meteor.Error(403, 'List with this URL already exists. Please choose a different one.');
      return;
    }
    var hash = newListData.hash.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    result.hash = hash;
    //insert new list with dummy criteria
    result.newListId = Lists.insert({
        owner: userId,
        hash: hash,
        name: newListData.name,
        description: newListData.description,
        criteria: [
          {
            name: "Important"
          },
          {
            name: "Urgent"
          }
        ],
        isActive: true
    });

    //insert dummy items
    Items.insert({
      list: result.newListId,
      owner: userId,
      order: 1,
      headline: "Great idea 1",
      description: "Great idea 1 long description"
    });

    Items.insert({
      list: result.newListId,
      owner: userId,
      order: 2,
      headline: "Great idea 2",
      description: "Great idea 2 long description"
    });

    return result;
  }
});
