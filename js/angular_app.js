'use strict';

/*
Angular app script, to handle basic routing for the site as well as resource loading.
*/

var spikes = angular.module('spikes', [
  'ngRoute',
  'ngResource'
]);

// Resource service for loading champion data for d3
spikes.factory('MatchData', function($resource, $q) {
  return function(matchId) {
    console.log('Loading', matchId);
    return $q.all({
      match: $resource('data/' + matchId + '.json', {}, {}).get().$promise,
      items: $resource('data/item.json', {}, {}).get().$promise
    });
  };
});

// Site-wide controller
spikes.controller('MainCtrl', function() {
  console.log('I\'m the main controller!');
  // $scope.$on('$viewContentLoaded', function(event) {
  //   $window.ga('send', 'pageview', { page: $location.url() });
  // });
});

// Champ page controller
spikes.controller('MatchDataCtrl', function($scope, $location, $routeParams, MatchData) {
  console.log('I\'m the match controller!');
  $scope.loading = true;

  function preprocessData(match) {
    for (let participant of match.participants) {
      participant.itemsEvents = [];
    }

    for (let frame of match.timeline.frames) {
      if (!frame.events) continue;

      for (let evt of frame.events) {
        if (evt.participantId === 0) continue;

        switch (evt.eventType) {
          case 'ITEM_DESTROYED':
            // console.log(evt);
          case 'ITEM_PURCHASED':
          case 'ITEM_SOLD':
          case 'ITEM_UNDO':
            match.participants[evt.participantId - 1].itemsEvents.push(evt);
            break;
        }
      }
    }

    return match.participants;
  }

  MatchData($routeParams.matchId)
    .then(function(result) {
      $scope.loading = false;
      $scope.data = preprocessData(result.match);
      $scope.items = result.items;
    })
    .catch(function(err) {
      console.error(err);
      $location.path('/404').replace();
    });
});

// Routing for the site
spikes.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/index.html'
    })
    .when('/404', {
      templateUrl: 'views/404.html'
    })
    .when('/match/:matchId', {
      templateUrl: 'views/match.html',
      controller: 'MatchDataCtrl'
    })
    .otherwise('/404');
});
