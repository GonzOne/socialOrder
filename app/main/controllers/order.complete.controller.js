'use strict';
angular.module('main')
    .controller('OrderCompleteController', function ($scope) {
      var vm = this;
      vm.selected;
      //exports
      vm.send  = send;
      vm.reasons = [
            { reason: 'Your drinks are ready at the bar.', value: 1},
            { reason: 'Your drinks are in route.', value: 2}
      ];
      function send () {
        var result;
        if ( vm.selected > 0 ) {
          result = {value: vm.selected, msg: vm.reasons[vm.selected - 1].reason };
        } else {
          result = {value: vm.selected, msg: '' };
        }
        $scope.closeModal(result);
      }
    });
