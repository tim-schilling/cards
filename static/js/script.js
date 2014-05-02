(function() {
  var CARD_STATES, MAX_CARD_ZINDEX, activeCard, app;

  app = angular.module('cards.app.game', ['ngRoute', 'ngAnimate', 'cards.api']);

  app.config(function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: 'static/pages/game.html',
      controller: 'gameController'
    }).when('/heart', {
      templateUrl: 'static/pages/heart.html',
      controller: 'cardController'
    }).when('/leaf', {
      templateUrl: 'static/pages/leaf.html',
      controller: 'cardController'
    }).when('/tree', {
      templateUrl: 'static/pages/tree.html',
      controller: 'cardController'
    }).when('/flame', {
      templateUrl: 'static/pages/flame.html',
      controller: 'cardController'
    });
  });

  CARD_STATES = {
    UPSIDE_DOWN: 1,
    VISIBLE: 2
  };

  activeCard = null;

  MAX_CARD_ZINDEX = 2005;

  app.controller('gameController', [
    '$scope', function($scope) {
      var card, cards, socket, suit, _flipped, _i, _j, _len, _len1, _ref, _ref1;
      cards = [];
      _ref = ['heart', 'flame', 'leaf', 'tree'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        suit = _ref[_i];
        _ref1 = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          card = _ref1[_j];
          cards.push({
            card: card,
            suit: suit,
            state: CARD_STATES.UPSIDE_DOWN,
            template: "static/pages/" + suit + ".html"
          });
        }
      }
      $scope.cards = cards;
      $scope.CARD_STATES = CARD_STATES;
      $scope.events = {};
      $scope.events.cardMouseDown = function(card, event) {
        var currentZ;
        activeCard = $(event.target);
        currentZ = parseInt(activeCard.css('z-index'));
        activeCard.css('z-index', currentZ + MAX_CARD_ZINDEX);
        $('html').on('mousemove', function(event) {
          console.log('mousemove');
          if (activeCard !== null && activeCard.length > 0) {
            activeCard.css('top', event.clientY - 50);
            return activeCard.css('left', event.clientX - 40);
          } else {
            return $('html').off('mousemove');
          }
        });
      };
      $scope.events.cardDoubleClick = function(card, event) {
        if (card.state === CARD_STATES.UPSIDE_DOWN) {
          card.state = CARD_STATES.VISIBLE;
        } else {
          card.state = CARD_STATES.UPSIDE_DOWN;
        }
      };
      $scope.events.shuffleClick = function() {
        $('.card').each(function() {
          return $(this).css('z-index', Math.floor(Math.random() * (MAX_CARD_ZINDEX - 5) + 5).toString());
        });
      };
      _flipped = false;
      $scope.events.flipAllClick = function(cards) {
        var new_state, _k, _len2;
        new_state = _flipped ? CARD_STATES.VISIBLE : CARD_STATES.UPSIDE_DOWN;
        for (_k = 0, _len2 = cards.length; _k < _len2; _k++) {
          card = cards[_k];
          card.state = new_state;
        }
        return _flipped = !_flipped;
      };
      $('html').on('mouseup click', function() {
        var currentZ;
        console.log('mouseup');
        if (activeCard !== null) {
          console.log('mouseup registered');
          $('html').off('mousemove');
          currentZ = parseInt(activeCard.css('z-index'));
          activeCard.css('z-index', currentZ - MAX_CARD_ZINDEX);
          activeCard = null;
        }
      });
      socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
      console.log(socket);
      return socket.on('my response', function(msg) {
        return console.log(msg);
      });
    }
  ]);

  app.controller('cardController', ['$scope', function($scope) {}]);

}).call(this);

(function() {
  var app;

  app = angular.module('cards.api', ['ngResource']);

  app.factory('Cards', [
    '$resource', function($resource) {
      return $resource('/api/teams/:team_id/athletes/:id', {
        id: '@id',
        team_id: '@team.id'
      });
    }
  ]);

}).call(this);
