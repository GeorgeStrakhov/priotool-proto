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
    if(!button.attr('id')) {
      button = button.closest('button');
    }
    var action = button.attr('id').split('---')[1];
    applyItemAction(action, this._id);
  },
  'click #addNewItem': function(e, template) {
    e.preventDefault();
    var listId = template.data.list._id;
    var newItemOrder = template.data.items[template.data.items.length -1].order + 1;
    var newItemId = Items.insert({
      list: listId,
      owner: Meteor.userId(),
      order: newItemOrder,
      headline: "Brilliant Idea Headline",
      description: "Brillian Idea Description"
    });
  }
    
});

var applyItemAction = function(action, id) {
  if(action == 'delete') {
    if(Items.find().count() === 1) {
      throwError('You need at least one item!');
      return;
    }
    Items.remove(id);
    updateItemOrders();
  }
  var modifier = -1;
  if(action == 'moveDown') {
    modifier = +1;
  }
  if(action == 'moveUp' || action == 'moveDown') {
    //find next item
    var currentItemOrder = Items.findOne(id).order;
    var nextItem = Items.findOne({order: currentItemOrder+modifier});
    if(currentItemOrder && nextItem) {
      switchItemOrders(id, nextItem._id);
    }
  }
}

var switchItemOrders = function(id1, id2) {
  var item1 = Items.findOne(id1);
  var item2 = Items.findOne(id2);
  if(item1 && item2) {
    Items.update({_id: id1}, {
      $set: {order: item2.order}
    });
    Items.update({_id: id2}, {
      $set: {order: item1.order}
    });
  }
}

var updateItemOrders = function() {
  var items = Items.find({}, {sort: {order: 1}}).fetch();
  $.each(items, function(k,v) {
    Items.update({_id: v._id}, {
      $set: {order: k+1}
    });
  });
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
