//insert fixture user
if(Meteor.users.find().count() === 0) {
  var testUser1 = Meteor.users.insert({});
  var testUser2 = Meteor.users.insert({});
  var testUser3 = Meteor.users.insert({});
}

//insert fixture list
if (Lists.find().count() === 0) {
  var testList = Lists.insert({
    owner: testUser1,
    hash: "test",
    name: "Test List",
    description: "Test list description",
    criteria: [
      {
        name: "criteria 1"
      },
      {
        name: "criteria 2"
      }
    ],
    status: "active"
  });
}

//insert fixture items
if(Items.find().count() === 0) {
  var testItem1 = Items.insert({
    list: testList,
    order: 3,
    headline: "idea 3",
    description: "idea 3 description"
  });
  var testItem2 = Items.insert({
    list: testList,
    order: 1,
    headline: "idea 1",
    description: "idea 1 description"
  });
  var testItem3 = Items.insert({
    list: testList,
    order: 2,
    headline: "idea 2 blah",
    description: "idea 2 description"
  });
}

//insert fixutre scores
if(Scores.find().count() === 0) {
  Scores.insert({
    item: testItem1,
    list: testList,
    user: testUser1,
    userScores: [3,2]
  });
  Scores.insert({
    item: testItem1,
    list: testList,
    user: testUser2,
    userScores: [0,1]
  });
  Scores.insert({
    item: testItem2,
    list: testList,
    user: testUser1,
    userScores: [5,4]
  });
  Scores.insert({
    item: testItem2,
    list: testList,
    user: testUser2,
    userScores: [1,1]
  });
  Scores.insert({
    item: testItem3,
    list: testList,
    user: testUser1,
    userScores: [0,5]
  });
  Scores.insert({
    item: testItem3,
    list: testList,
    user: testUser2,
    userScores: [2,1]
  });
}
