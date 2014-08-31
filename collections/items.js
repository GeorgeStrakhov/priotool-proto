Items = new Meteor.Collection('items');

Items.allow({
  update: docOwner,
  remove: docOwner,
  insert: docOwner 
});

var docOwner = function(userId, doc) {
    if(!userId) {
      sayNo();
      return false;
    }
    if(userId !== doc.owner) {
      sayNo();
      return false;
    }
    return true;
};

var sayNo = function() {
  throw new Meteor.Error(401, 'How dare you!');
}
