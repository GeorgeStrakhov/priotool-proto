//config
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

//route map
Router.map(function(){
  this.route('home', {
    path: '/'
  });
  this.route('buildlist', {
    path: '/create'
  });
});
