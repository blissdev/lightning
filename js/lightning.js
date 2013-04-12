SC.initialize({
  client_id: 'd214e0bc838d15c8b31cca256119cb23',
  redirect_uri: window.location + 'callback.html'
});

var connector = document.getElementById('connector');
var play = document.getElementById('play-control');
var next = document.getElementById('next');

function Player(sounds) {
  this.sounds = sounds;
  this.state = 'initial';
  //SC.whenStreamingReady(this.startSession(this));
  SC.whenStreamingReady(function() { console.log('streaming is ready') });
}

Player.prototype.startSession = function(player) {
  return function() {
    player.playRandom.call(player, null);
  }
}

Player.prototype.playRandom = function() {
  var player = this;
  console.log('playing a random sound');
  window.sm = SC.stream(this.getRandomSound(), {
    autoPlay: true,
    onfinish: function() {
      player.playRandom();

      console.log('the song is over :(');
    }
  });
  this.state = 'playing';
}

Player.prototype.pause = function() {
  console.log('pausing');
  window.sm.pause();
  this.state = 'paused';
}
Player.prototype.resume = function() {
  console.log('resuming');
  window.sm.resume();
  this.state = 'playing';
}

Player.prototype.next = function() {
  console.log('nexting');
  var current = sm;
  this.playRandom();
  current.destruct();
}

Player.prototype.phase = function(state) {
  var currentState = this.state;
  console.log('current state', currentState);
  if(currentState == 'initial') this.playRandom();
  if(currentState == 'playing') this.pause();
  if(currentState == 'paused') this.resume();
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

play.addEventListener('click', function() {
  player.phase();
});

next.addEventListener('click', function() {
  player.next();
});


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

