Listparticipants = new Meteor.Collection('listparticipants');

Listparticipants.deny({
  insert: function(userId, doc) {
    if(!doc.user || !doc.list || !doc.username) return true;
  }
});

Listparticipants.allow({
  insert: function(userId, doc) {
    if(doc.user != userId) return false;
    var already = Listparticipants.findOne({user: userId, list: doc.list});
    if(already) return false;
    return true;
  }
});
