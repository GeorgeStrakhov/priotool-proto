//publish single list
Meteor.publish('listInfo', function(listHash) {
  return Lists.find({hash: listHash});
});

//publish listItems
Meteor.publish('listItems', function(listHash) {
  var list = Lists.findOne({hash: listHash});
  if(!list) return null;
  return Items.find({
    list: list._id
  }, {sort: {order: 1}});
});

//publish listScores
Meteor.publish('listScores', function(listHash) {
  var list = Lists.findOne({hash: listHash});
  if(!list) return null;
  return Scores.find({
    list: list._id
  });
});
