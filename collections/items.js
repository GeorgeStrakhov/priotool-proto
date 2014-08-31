Items = new Meteor.Collection('items');

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

Items.allow({
  update: docOwner,
  remove: docOwner,
  insert: docOwner 
});


var sayNo = function() {
  throw new Meteor.Error(401, 'How dare you!');
}
