Template.scoringItemCriteria.rendered = function() {
  var self = this;
  templateData = self.data;
  item = Items.findOne(templateData.itemId);
  var inputField = self.$('input');
  inputField.slider();
  self.autorun(function() {
    var userItemScore = Blaze.getData();
    recreateSlider(item.list, userItemScore, inputField);
  });
};

var recreateSlider = function(listId, userItemScore, inputField) {
  var itemId = userItemScore.itemId;
  //destroy old one
  if(inputField.slider) {
    inputField.slider('destroy');
  }
  //create new one
  inputField.slider();
  //set correct value
  inputField.slider('setValue', userItemScore.score);
  //attach listener
  inputField.on('slideStop', function(e) {
    if(!e.value) {
      e.value = 0;
    }
    var newUserScores = [];
    $('input').each(function(k,v) {
      newUserScores[k] = Number($(v).val());
    });
    upsertUserScores(listId, itemId, newUserScores);
  });
};

var upsertUserScores = function(listId, itemId, newScores) {
  //find out if there was a previous score record
  var oldScore = Scores.findOne({ 
        user: Meteor.userId(),
        item: itemId
      });
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
          item: itemId,
          list: listId,
          user: Meteor.userId(),
          userScores: newScores
        },
        function(error) {
          if (error) {
            // display the error to the user
            throwError(error.reason);
          }
        });
  }
};
