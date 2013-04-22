
  (function( window, undefined ) {

    var document = window.document;

    function Player(cloud) {
      this.cloud = cloud;
      this.state = 'stopped';
      this.queue = [];

      this.view = {};
    }

    Player.prototype.initialize = function(el) {
      this.element = el;

      this.playbackControl = el.find('#playback-control');
      this.playbackControl.on('click', this.togglePlayback.bind(this));

      this.nextControl = el.find('#next-control');
      this.nextControl.on('click', this.playNext.bind(this));

      this.soundElement = window.Lightning.element('.active-sound');
      this.view.song = this.soundElement.find('.song');
      this.view.artist = this.soundElement.find('.artist');
      this.view.artwork = this.soundElement.find('.artwork');

      // start loading first sound
      this.loadNextSound();
    }

    Player.prototype.togglePlayback = function() {
      var state = this.state;
      if(state == 'stopped') {
        this.active = this.queue.shift();
        console.log('attempting to play', this.active.sound.title);
        this.active.streamSound();
        this.renderSound();
        this.loadNextSound();
        this.state = 'playing';
      }

      if(state == 'playing') {
        console.log('should be pausing');
        this.active.stream.pause();
        this.state = 'paused';
      }

      if(state == 'paused') {
        this.active.stream.resume();
        this.state = 'playing';
      }
    }

    Player.prototype.playNext = function() {
      this.active.stream.destruct();
      console.log('was playing', this.active.sound.title);
      this.active = this.queue.shift();
      console.log('attempting to play next song', this.active.sound.title);
      this.active.streamSound();
      this.renderSound();
      this.loadNextSound();
    }

    Player.prototype.renderSound = function() {
      var sound = this.active.sound;

      this.view.song.htmlContent( sound.title );
      this.view.song.el.setAttribute('href', sound.permalink_url);
      this.view.artist.htmlContent( sound.user.username );
      this.view.artist.el.setAttribute('href', sound.user.permalink_url);
      this.view.artwork.el.setAttribute('src', sound.artwork_url);
    }

    Player.prototype.loadNextSound = function() {
      var sound = this.cloud.randomSound();
      this.queue.push(new Playable(this, sound));
      console.log(this.queue);
    }

    function Playable(player, sound) {
      this.sound = sound;
      this.player = player;

      this.streamSound = function() {
        var player = this.player;
        this.stream = SC.stream(sound.stream_url, {
          autoPlay: true,
          onfinish: function() {
            player.playNext();
          }
        });
      }
    }

    window.Lightning = window.Lightning || {};
    window.Lightning.Player = Player;

  })( window );

