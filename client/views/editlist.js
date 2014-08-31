Template.editlist.events({
  'blur .autosave': function(e) {
    //autosave params on blur
    var inputObj = $(e.target);
    var inputObjData = inputObj.attr('id').split('---');
    var id = inputObjData[1];
    var propertyName = inputObjData[2];
    var updateObj = {};
    updateObj[propertyName] = inputObj.val();
    if(inputObjData[0] == 'list') {
      Lists.update({_id: id}, {$set: updateObj}, function(error, result){
        if(error) {
          throwError(error.reason);
        }
      });
    }
    if(inputObjData[0] == 'item') {
      Items.update({_id: id}, {$set: updateObj}, function(error, result){
        if(error) {
          throwError(error.reason);
        }
      });
    }
  },
  'blur .criteriaInput, keypress .criteriaInput': function(e, template) {
    if(e.type == "keypress") {
      if(e.which !== 13) return;
    }
    var templateData = template.data;
    updateListCriteria(templateData.list._id);
  },
  'click .removeCriteria': function(e, template) {
    var templateData = template.data;
    var inputObj = $(e.target).closest('.input-group').find('input').first();
    inputObj.val('');
    updateListCriteria(templateData.list._id);
  },
  'click .itemAction': function(e, template) {
    var button = $(e.target);
    var action = button.attr('id').split('---')[1];
    applyItemAction(action, this._id);
  }
});

var applyItemAction = function(action, id) {
  if(action == 'delete') {
    Items.remove(id);
  }
}

var updateListCriteria = function(listId) {
  var newCriteria = [];
  $('.criteriaInput').each(function(k,v){
    var newVal = $(v).val();
    if(newVal) {
      newCriteria.push({name: newVal});
    }
  });
  if(newCriteria.length == 0) {
    throwError('We need at least one criteria to rate!');
    return;
  }
  Lists.update({_id: listId},
      {
        $set: {
          criteria: newCriteria
        }
      }, function(error, result) {
        if(error) {
          throwError(error.reason);
        }
        if(result) {
          $('.criteriaInput').last().val('');
        }
  });
};
