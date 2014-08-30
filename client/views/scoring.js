Template.scoring.events({
  'change input': function(e, template) {
    e.preventDefault();
    //store template data
    var templateData = template.data;
    //get the new scores
    var newScores = [];
    $('input').each(function(){
      var inp = $(this);
      newScores.push(Number(inp.val()));
    });
    //find out if there was a previous score record
    var oldScore = Scores.findOne(
      { 
        user: Meteor.userId(),
        item: templateData.item._id
      }
    );
    if(oldScore) {
      //update score value
      Scores.update(
        { 
          _id: oldScore._id
        },
        {
          $set: {
            userScores: newScores
          }
        },
        function(error) {
          if (error) {
            // display the error to the user
            throwError(error.reason);
          }
        }
      );
    } else {
      //insert new score
      Scores.insert(
        {
          item: templateData.item._id,
          list: templateData.list._id,
          user: Meteor.userId(),
          userScores: newScores
        },
        function(error) {
          if (error) {
            // display the error to the user
            throwError(error.reason);
          }
        }
      );
    }
  }
});
