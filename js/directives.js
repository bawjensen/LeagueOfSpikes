'use strict';

spikes.directive('matchVisualization', function() {
  function showParticipants(participants) {

  }

  return {
    restrict: 'E',
    scope: {
      val: '=',
      endtime: '='
    },
    link: function(scope, element, attrs) {
      // set up initial svg object
      var $container = $(element[0]);

      scope.$watch('val', function(participants) {
        // if 'val' is undefined, exit
        if (!participants) {
          return;
        }

        for (let participant of participants) {
          var $participantItemHistory = $('<div>');

          for (let evt of participant.itemsEvents) {
            var itemId = evt.itemId || evt.itemBefore || evt.itemAfter;

            var $evtDiv = $('<div>');
            $evtDiv.append($('<img>', { src: 'http://ddragon.leagueoflegends.com/cdn/5.18.1/img/item/' + scope.$parent.items.data[itemId].image.full }));
            $evtDiv.append($('<span>', { text: evt.eventType }));
            $evtDiv.append($('<span>', { text: evt.timestamp }));
            $participantItemHistory.append($evtDiv);
          }

          $container.append($participantItemHistory);
        }
      });

      scope.$watch('endtime', function(newVal) {
        console.log('Hi');
        scope.$parent.endtime = parseInt(newVal);
        console.log(scope.$parent);
      });
    }
  }
});