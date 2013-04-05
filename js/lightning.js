SC.initialize({
  client_id: 'd214e0bc838d15c8b31cca256119cb23',
  redirect_uri: window.location + 'callback.html'
});

var connector = document.getElementById('connector');

function Player(sounds) {
  this.sounds = sounds;
  SC.whenStreamingReady(this.startSession(this));
}

Player.prototype.startSession = function(player) {
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

function loadFavorites() {
  console.log('loading favorites');
  SC.get('/me/favorites', { limit: 200 }, function(favorites) {
    window.player = new Player(favorites);
  });

  // save token if doesnt already exist
  // @TODO dont run this code if we already know it exists
  if(!localStorage.getItem('scapitkn')) {
    localStorage.setItem('scapitkn', window.SC.storage().getItem('SC.accessToken'));
  }
}


// initialize
if(localStorage.getItem('scapitkn')) {
  console.log('token found');
  window.SC.storage().setItem('SC.accessToken', localStorage.getItem('scapitkn'));
  loadFavorites();
} else {
  console.log('attempting to acquire new token');
  connector.classList.add('visible');
  connector.addEventListener('click', function() {
    SC.connect(loadFavorites);
  });
}

