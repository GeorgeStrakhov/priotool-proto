Lists = new Meteor.Collection('lists');

Lists.allow({
  update: function(userId, doc, fields, modifier) {
    if(!userId) {
      sayNo();
      return false;
    }
    if(userId !== doc.owner) {
      sayNo();
      return false;
    }
    return true;
  }
});


var sayNo = function() {
  throw new Meteor.Error(401, 'How dare you!');
}
