Template.scoring.events({
  'click .btn-go' : function (e,template) {
    e.preventDefault();
    var btn = $(e.target);
    var order = template.data.nextOrder;
    if(btn.hasClass('btn-go-prev')) {
      order = template.data.prevOrder;
    }
    $("html, body").animate({ scrollTop: 0 }, "slow");
    Router.go('scoring', {listHash: template.data.list.hash, itemOrder: order});
  }
});
