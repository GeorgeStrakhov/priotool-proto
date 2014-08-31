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

//clear errors on route change
Router.onBeforeAction(function() { clearErrors() });

//route map
Router.map(function(){

  //home
  this.route('home', {
    path: '/'
  });

  //create a new list
  this.route('buildlist', {
    path: '/create',
    data: function() {
      var data = {};
      data.MeteorUrl = Meteor.absoluteUrl();
      return data;
    }
  });

  //display a single list (welcome)
  this.route('displaylist', {
    path: '/lists/:listHash',
    waitOn: function() { 
      return [
        Meteor.subscribe('listInfo', this.params.listHash),
        Meteor.subscribe('listItems', this.params.listHash),
        Meteor.subscribe('listScores', this.params.listHash),
        Meteor.subscribe('listParticipants', this.params.listHash)
      ]
    },
    data: function() {
      var data = {};
      data.list = Lists.findOne({hash: this.params.listHash});
      if(!data.list) return null;
      return data;
    }
  });

  //edit list
  this.route('editlist', {
    path: '/lists/:listHash/edit/',
    waitOn: function() {
      return [
        Meteor.subscribe('listInfo', this.params.listHash),
        Meteor.subscribe('listItems', this.params.listHash),
      ]
    },
    onAfterAction: function () {
      //redirect if no authed user
      if(!Meteor.user()) {
        Router.go('home');
      }
      //redirect if user is not the owner of this list
      var list = Lists.findOne({hash: this.params.listHash});
      if(list.owner !== Meteor.userId()) {
        Router.go('home');
      }
    },
    data: function() {
      var data = {};
      //get the list
      data.list = Lists.findOne({hash: this.params.listHash});
      if(!data.list) return null;
      //get all items
      data.items = Items.find({list: data.list._id}, {sort: {order: 1}}).fetch();
      return data;
    }
  });

  //display list results
  this.route('listresults', {
    path: '/lists/:listHash/results/',
    waitOn: function() {
      return [
        Meteor.subscribe('listInfo', this.params.listHash),
        Meteor.subscribe('listItems', this.params.listHash),
        Meteor.subscribe('listScores', this.params.listHash),
        Meteor.subscribe('listParticipants', this.params.listHash)
      ]
    },
    data: function() {
      var data = {};
      //get the list
      data.list = Lists.findOne({hash: this.params.listHash});
      if(!data.list) return null;
      //get all items
      data.items = Items.find({list: data.list._id}, {sort: {order: 1}}).fetch();
      //get all participants
      data.listParticipants = Listparticipants.find().fetch();
      //get criteria names
      data.criteria = data.list.criteria;
      //prepare results data (by criteria or total sum of all)
      data.results = [];
      //TODO refactor this ugly bit of triple-nested iteration
      // 1.for each item
      $.each(data.items, function(itemK,itemV) {
        //2. get all the scores
        var itemScoresArray = Scores.find({item: itemV._id}).fetch();
        var itemScoresData = {};
        itemScoresData.total = 0;
        itemScoresData.criteriaData = [];
        //3. for each user score
        $.each(itemScoresArray, function(userScoreK, userScoreV) {
          //4. get scoring data
          var userScoringArray = userScoreV.userScores;
          //5. for each criteria
          $.each(data.criteria, function(criteriaK, criteriaV) {
            var itemUserCriteriaScore = userScoringArray[criteriaK];
            //6. add scoring data
            if(!itemScoresData.criteriaData[criteriaK]) itemScoresData.criteriaData[criteriaK] = 0;
            itemScoresData.criteriaData[criteriaK] += itemUserCriteriaScore;
            //7. add to total
            itemScoresData.total += itemUserCriteriaScore;
          });
        });
        data.results.push({
          headline: itemV.headline,
          scores: itemScoresData
        });
      });
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
      //redirect if no user
      if(!Meteor.user()) {
        Router.go('displaylist', {listHash: data.list.hash});
      }
      //get all items
      data.items = Items.find({list: data.list._id}).fetch();
      //get the item
      var itemOrder = Number(this.params.itemOrder);
      data.item = Items.findOne({list: data.list._id, order: itemOrder});
      if(data.item) {
        data.isLastItem = (data.item.order >= data.items.length) ? true : false;
        data.nextOrder = data.item.order + 1;
        data.isFirstItem = (data.item.order === 1) ? true : false;
        data.prevOrder = data.item.order -1;
        //build userItemScores
        var criteria = data.list.criteria;
        var userItemScores = Scores.findOne({
          user: Meteor.userId(),
          item: data.item._id
        });

        //if no recorded item scores for this user populate with zeroes
        data.userScoreId = null;
        if(!userItemScores) {
          userItemScores = [];
          $.each(criteria, function(k,v) {
            userItemScores.push(0);
          });
        } else {
          userItemScores = userItemScores.userScores;
          data.userScoreId = userItemScores._id;
        }
        data.userItemScores = [];  
        $.each(data.list.criteria, function(criteriaK, criteriaV) {
          data.userItemScores.push({
            criteriaName: criteriaV.name,
            criteriaKey: criteriaK,
            score: userItemScores[criteriaK],
            itemId: data.item._id
          });
        });
      } else {
        Router.go('displaylist', {listHash: data.list.hash});
      }
      return data;
    }
  });
});
