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
    //create dummy data
    var newListObj = {
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
    };

    var items = [
      {
        owner: userId,
        order: 1,
        headline: "Great idea 1",
        description: "Great idea 1 long description"
      },
      {
        owner: userId,
        order: 2,
        headline: "Great idea 2",
        description: "Great idea 2 long description"
      }
    ];

    //check if we are cloning from another list
    if(newListData.cloneFrom) {
      var cloneFromList = Lists.findOne(newListData.cloneFrom);
      if(cloneFromList) {
        newListObj.criteria = cloneFromList.criteria;
        items = getItemsFromList(cloneFromList._id);
      }
    }

    //insert new list
    result.newListId = Lists.insert(newListObj);

    //insert items
    _.each(items, function(item) {
      item.list = result.newListId;
      Items.insert(item);
    });

    return result;
  }
});

var getItemsFromList = function(listId) {
  var allItems = Items.find({list: listId}).fetch();
  var readyItems = [];
  _.each(allItems, function(item) {
    delete(item._id);
    delete(item.listId);
    readyItems.push(item);
  });
  return readyItems;
};
