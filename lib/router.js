//config
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'pageNotFound'
});

//not found wait
if (Meteor.isClient) {
  Router.onBeforeAction('dataNotFound');
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

  //display a single list (info or results)
  this.route('displaylist', {
    path: '/lists/:listHash',
    waitOn: function() { 
      return Meteor.subscribe('singlelist', this.params.listHash);
    },
    data: function() {
      var data = {};
      data.list = Lists.findOne({hash: this.params.listHash});
      if(!data.list) return null;
      return data;
    }
  });

  //scoring
  this.route('scoring', {
    path: '/lists/:listHash/score/:itemNum?',
    waitOn: function() { 
      return Meteor.subscribe('singlelist', this.params.listHash);
    },
    data: function() {
      var data = {};
      data.list = Lists.findOne({hash: this.params.listHash});
      if(!data.list) return null;
      data.currentItemNum = this.params.itemNum;
      data.currentItem = data.list.items[data.currentItemNum];
      if(data.currentItem) {
        data.nextItemNum = Number(data.currentItemNum) + 1;
      }
      if(!data.nextItemNum || data.nextItemNum == data.list.length) {
        data.nextItemNum = '';
      }
      return data;
    }
  });


  //LAST: not found
  this.route('pagenotfound', {
    path: '/*',
    template: 'pageNotFound'
  });
});

//loading
Router.onBeforeAction('loading');
