'use strict';
angular.module('main')
    .controller('TermsCtrl', function ($scope) {
      var vm = this;
      //exports
      vm.agree = agree;

      function agree () {
        $scope.closeModal(true);
      }
    });
