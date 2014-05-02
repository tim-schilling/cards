app = angular.module 'cards.api', ['ngResource']

app.factory 'Cards', ['$resource', ($resource) ->
    $resource '/api/teams/:team_id/athletes/:id', {id: '@id', team_id: '@team.id'}
]