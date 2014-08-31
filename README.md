# PRIOTOOL
Prioritize lists together in real time.

## How it works:
1. You create a new list (item names - item descriptions)
2. You choose prioritization criteria
3. You launch the voting, which gives you a secure unique link to share with your collaborators
4. Your collaborators go to the link on any device
5. They put their name in and start rating items one by one
6. You see results in real time on your screen

## Data Structure:
* Users
* Lists (belong to users)
* Listparticipants (belong to lists)
* Items (belong to lists)
* Scores (belong to items & users)

## Technology stack
* meteor
* bootstrap-3

## Meteor Packages used:
* standard-app-packages
* mrt:bootstrap-3
* accounts-password
* iron:router
* mrt:accounts-ui-bootstrap-3
* sacha:spinner
* jquery

## To Do
* Create list (step 1 -> registration, hash, name, description, criteria)
* Edit list (step 2 -> hash, name, description, criteria, isActive)
* My lists
* security rules
* List.isActive (on/off switch & associated behavior)
* Results redo:
  view various criteria separately...
* Styling
* Branding
* Mobile test
* Domain & DNS (point to Meteor servers)
* Deploy
* Full user scoring stats for the list owner (username -> item -> criteria -> scores)

## Done
* Users
* Lists
* Items
* Scoring
* Results display
* List partiicpants
