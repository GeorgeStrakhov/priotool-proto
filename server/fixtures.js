//insert fixture user
if(Meteor.users.find().count() === 0) {
  var testUser1 = Meteor.users.insert({});
  var testUser2 = Meteor.users.insert({});
  var testUser3 = Meteor.users.insert({});
}

//insert fixture list
if (Lists.find().count() === 0) {
  Lists.insert({
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
    items: [
      {
        headline: "first idea",
        description: "Idea description description",
        scores: [
          {
            voterId: testUser2,
            votes: [5,1]
          },
          {
            voterId: testUser3,
            votes: [2,4]
          }
        ]
      },
      {
        headline: "second idea",
        description: "Idea description description",
        scores: [
          {
            voterId: testUser2,
            votes: [0,0]
          },
          {
            voterId: testUser3,
            votes: [1,2]
          }
        ]
      },
      {
        headline: "third idea long idea",
        description: "Idea description description",
        scores: [
          {
            voterId: testUser2,
            votes: [5,5]
          },
          {
            voterId: testUser3,
            votes: [4,4]
          }
        ]
      },
    ],
    status: "active"
  });
}
