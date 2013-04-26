
  (function( window, undefined ) {

    var document = window.document;
    var cloud = new window.Lightning.Cloud();
    var player = new window.Lightning.Player(cloud);
    var initialPane, action;

    if( cloud.alreadyAuthenticated() ) {
      cloud.retrieveFavorites(readyToPlay, showConnect);
    } else {
      // show fresh load ui
      showConnect();
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
        });

        target.off('click', handler);
      }
      return handler;
    }

    function showConnect() {
      initialPane = element('#pane-fresh');
      initialPane.addClass('active');
      action = element('#connect');
      action.on('click', onAuthenticated(action));
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

