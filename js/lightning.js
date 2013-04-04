function Player(sounds) {
  this.sounds = sounds;
  SC.whenStreamingReady(this.startSession);
}

Player.prototype.startSession = function() {
  var player = this;

  return function() {
    player.playRandom.call(player, null);
  }
}

Player.prototype.playRandom = function() {
  var player = this;
  console.log('playing a random sound');
  SC.stream(this.getRandomSound(), {
    autoPlay: true,
    onfinish: function() {
      player.playRandom();

      console.log('the song is over :(');
    }
  });
}

Player.prototype.getRandomSound = function() {
  var index = Math.floor(Math.random() * this.sounds.length);
  return this.sounds[index].stream_url;
}

SC.initialize({
  client_id: 'd214e0bc838d15c8b31cca256119cb23',
  redirect_uri: 'http://blissdev.github.com/lightning/callback.html'
});

// initiate auth popup
SC.connect(function() {
  SC.get('/me/favorites', { limit: 200 }, function(favorites) {
    window.player = new Player(favorites);
  });
});
