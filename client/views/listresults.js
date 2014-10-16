Template.listresults.events({
  'change .selectResultView' : function(e, template) {
    var selectedCriteria = $('.selectResultView').val();
    if(selectedCriteria == 'total') {
      Router.go('listresults', {
        listHash: template.data.list.hash
      });
      return;
    }
    Router.go('listresults', {
      listHash: template.data.list.hash,
      sortCriteria: selectedCriteria 
    });
  }
});
