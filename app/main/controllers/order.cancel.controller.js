'use strict';
angular.module('main')
    .controller('CancelOrderModalController', function ($scope) {
      var vm = this;
      vm.selected;
      vm.reasons = [
          { reason: 'We don\'t have that item, sorry!', value: 1},
          { reason: 'We already announced last call, sorry.', value: 2},
          { reason: 'I\'m to busy, sorry.', value: 3},
          { reason: 'I\'m not allowed to serve you, sorry.', value: 4}
      ];
        //exports
      vm.send = send;

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
