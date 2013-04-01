SC.initialize({
  client_id: 'd214e0bc838d15c8b31cca256119cb23',
  redirect_uri: 'http://blissdev.github.com/lightning/callback.html'
});

// initiate auth popup
SC.connect(function() {
  SC.get('/me', function(me) {
    alert('Hello, ' + me.username);
  });
});
