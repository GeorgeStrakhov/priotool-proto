//publish single list
Meteor.publish('singlelist', function(hash) {
  return Lists.find({hash: hash});
});
