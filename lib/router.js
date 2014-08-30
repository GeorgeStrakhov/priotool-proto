//config
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'pageNotFound'
});

//not found wait
if (Meteor.isClient) {
  Router.onBeforeAction('dataNotFound');
  Router.onBeforeAction('loading');
}

//route map
Router.map(function(){

  //home
  this.route('home', {
    path: '/'
  });

  //create a new list
  this.route('buildlist', {
    path: '/create'
  });

  //display a single list (welcome or results)
  this.route('displaylist', {
    path: '/lists/:listHash',
    waitOn: function() { 
      return [
        Meteor.subscribe('listInfo', this.params.listHash),
        Meteor.subscribe('listItems', this.params.listHash),
        Meteor.subscribe('listScores', this.params.listHash)
      ]
    },
    data: function() {
      var data = {};
      data.list = Lists.findOne({hash: this.params.listHash});
      if(!data.list) return null;
      return data;
    }
  });

  //scoring items in a list
  this.route('scoring', {
    path: '/lists/:listHash/score/:itemOrder',
    waitOn: function() { 
      return [
        Meteor.subscribe('listInfo', this.params.listHash),
        Meteor.subscribe('listItems', this.params.listHash),
        Meteor.subscribe('listScores', this.params.listHash)
      ]
    },
    data: function() {
      var data = {};
      //get the list
      data.list = Lists.findOne({hash: this.params.listHash});
      if(!data.list) return null;
      data.items = Items.find({list: data.list._id}).fetch();
      //get the item
      var itemOrder = Number(this.params.itemOrder);
      data.item = Items.findOne({list: data.list._id, order: itemOrder});
      if(data.item) {
        data.isLastItem = (data.item.order >= data.items.length) ? true : false;
        data.nextOrder = data.item.order + 1;
      }
      return data;
    }
  });
});
