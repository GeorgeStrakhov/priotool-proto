Scores = new Meteor.Collection('scores');

//allow to insert & update scores for if the user == currentUser
Scores.allow({
  insert: ownAndOnlyScore,
  update: ownAndOnlyScore
});

function ownAndOnlyScore(userId, doc) {
  //check if the user is updating or inserting for his own user
  if(userId !== doc.user) return false;
  //check if there is already a score for this item for this user with a different id
  var oldScore = Scores.findOne({
    item: doc.item,
    user: doc.user
  });
  if(oldScore && (oldScore._id !== doc._id)) return false;
  return true;
}
