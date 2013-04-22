
  (function( window, undefined ) {

    var document = window.document;
    var cloud = new window.Lightning.Cloud();
    var player = new window.Lightning.Player(cloud);
    var initialPane, action;

    if( cloud.alreadyAuthenticated() ) {
      cloud.retrieveFavorites(readyToPlay);
    } else {
      // show fresh load ui
      initialPane = element('#pane-fresh');
      initialPane.addClass('active');
      action = element('#connect');
      action.on('click', onAuthenticated(action));
    }

    SC.whenStreamingReady(function() {
      window.soundManager.debugFlash = true;
      window.soundManager.debugMode = true;
      console.log('streaming is ready')
    });

    function onAuthenticated(target) {
      var handler = function(e) {
        cloud.authenticate(function() {
          cloud.retrieveFavorites(readyToPlay);
          //readyToPlay();
        });

        target.off('click', handler);
      }
      return handler;
    }

    function readyToPlay() {
      if(initialPane !== undefined) {
        initialPane.removeClass('active');
      }

      var playerElement = element('#pane-player');
      playerElement.addClass('active');

      player.initialize(playerElement);
    }

    // element wrapper
    function element(selector) {
      function Element(selector) {
        this.el = document.querySelector( selector );
        this.selector = selector;
      }

      Element.prototype.on = function( eventType, onEventCallback ) {
        this.el.addEventListener( eventType, onEventCallback );
      }

      Element.prototype.off = function( eventType, onEventCallback ) {
        this.el.removeEventListener( eventType, onEventCallback );
      }

      Element.prototype.addClass = function( classToAdd ) {
        this.el.classList.add( classToAdd  );
      }

      Element.prototype.removeClass = function( classToRemove ) {
        this.el.classList.remove( classToRemove );
      }

      Element.prototype.find = function(selector) {
        return new Element(this.selector + ' ' + selector);
      }

      Element.prototype.textContent = function(text) {
        this.el.textContent(text);
      }

      Element.prototype.htmlContent = function(html) {
        this.el.innerHTML = html;
      }

      return new Element(selector);
    }

    window.Lightning.cloud = cloud;
    window.Lightning.element = element;

  })( window );


/*SC.initialize({
  client_id: 'd214e0bc838d15c8b31cca256119cb23',
  redirect_uri: window.location + 'callback.html'
});


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
*/

