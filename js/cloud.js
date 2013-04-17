
  (function( window, undefined ) {

    var document = window.document;
    var SC = window.SC;

    function Cloud() {

      // initialize soundcloud sdk
      SC.initialize({
        client_id: 'd214e0bc838d15c8b31cca256119cb23',
        redirect_uri: window.location + 'callback.html'
      });

    }

    Cloud.prototype.alreadyAuthenticated = function() {
      if(localStorage.getItem('scapitkn')) {
        SC.storage().setItem('SC.accessToken', localStorage.getItem('scapitkn'));
        return true;
      } else {
        return false;
      }
    }

    Cloud.prototype.authenticate = function(onConnect) {
      SC.connect(onConnect);
    }

    Cloud.prototype.randomSound = function() {
      var index = Math.floor(Math.random() * this.favorites.length);
      return this.favorites[index];
    }

    Cloud.prototype.retrieveFavorites = function(onRetrieval) {
      var cloud = this;

      SC.get('/me/favorites', { limit: 200 }, function(favorites) {
        cloud.favorites = favorites;
        onRetrieval && onRetrieval();
      });

      // save token if doesnt already exist
      if(!localStorage.getItem('scapitkn')) {
        localStorage.setItem('scapitkn', window.SC.storage().getItem('SC.accessToken'));
      }
    }

    window.Lightning = window.Lightning || {};
    window.Lightning.Cloud = Cloud;

  })( window );

