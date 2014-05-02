app = angular.module 'cards.app.game', ['ngRoute', 'ngAnimate', 'cards.api']

app.config ($routeProvider) ->
    $routeProvider
        .when('/',
            templateUrl : 'static/pages/game.html',
            controller  : 'gameController'
        )
        .when('/heart', {
            templateUrl : 'static/pages/heart.html',
            controller  : 'cardController'
        })
        .when('/leaf', {
            templateUrl : 'static/pages/leaf.html',
            controller  : 'cardController'
        })
        .when('/tree', {
            templateUrl : 'static/pages/tree.html',
            controller  : 'cardController'
        })
        .when('/flame', {
            templateUrl : 'static/pages/flame.html',
            controller  : 'cardController'
        })
CARD_STATES = {UPSIDE_DOWN: 1, VISIBLE: 2}
activeCard = null
MAX_CARD_ZINDEX = 2005

app.controller 'gameController', ['$scope', ($scope) ->
    cards = []
    for suit in ['heart', 'flame', 'leaf', 'tree']
        for card in ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
            cards.push(
                card: card
                suit: suit
                state: CARD_STATES.UPSIDE_DOWN
                template: "static/pages/#{suit}.html"
            )
    $scope.cards = cards
    $scope.CARD_STATES = CARD_STATES

    $scope.events = {}
    $scope.events.cardMouseDown = (card, event) ->
        activeCard = $(event.target)
        currentZ = parseInt(activeCard.css('z-index'))
        activeCard.css('z-index', currentZ+MAX_CARD_ZINDEX)
        $('html').on 'mousemove', (event) ->
            console.log 'mousemove'
            if activeCard != null and activeCard.length > 0
                activeCard.css('top', event.clientY-50)
                activeCard.css('left', event.clientX-40)
            else
                $('html').off('mousemove')
        return

    $scope.events.cardDoubleClick = (card, event) ->
        if card.state == CARD_STATES.UPSIDE_DOWN
            card.state = CARD_STATES.VISIBLE
        else
            card.state = CARD_STATES.UPSIDE_DOWN
        return

    $scope.events.shuffleClick = () ->
        $('.card').each () ->
            $(this).css('z-index', Math.floor(Math.random() * (MAX_CARD_ZINDEX-5) + 5).toString())
        return

    _flipped = false
    $scope.events.flipAllClick = (cards) ->
        new_state = if _flipped then CARD_STATES.VISIBLE else CARD_STATES.UPSIDE_DOWN
        for card in cards
            card.state = new_state
        _flipped = !_flipped


    $('html').on 'mouseup click', () ->
        console.log 'mouseup'
        if activeCard != null
            console.log 'mouseup registered'
            $('html').off('mousemove')

            currentZ = parseInt(activeCard.css('z-index'))
            activeCard.css('z-index', currentZ-MAX_CARD_ZINDEX)
            activeCard = null
        return

    socket = io.connect('http://' + document.domain + ':' + location.port + '/test')
    console.log socket
    socket.on 'my response', (msg) ->
        console.log msg

]
app.controller 'cardController', ['$scope', ($scope) ->

]