'use strict';
angular.module('main')
    .controller('MessengerController', function ($scope, parameters, $state, MessageService, AppGlobals, $log) {
      var vm = this;
      vm.userMessage;
      vm.username = parameters.username;
      $log.log('parameters', parameters);
      //exports
      vm.sendDirectMessage = sendDirectMessage;

      function sendDirectMessage () {
        var obj = {
          message: vm.userMessage,
          role: AppGlobals.getUserRole()
        };
        MessageService.sendDirectMessageById(AppGlobals.getDirectChannelId(), obj);
        vm.userMessage = '';
      }
      function getDirectMessages () {
        vm.messages = MessageService.forDirectMessage(AppGlobals.getDirectChannelId());
      }
      getDirectMessages();
      $scope.$on('$ionicView.enter', function () {
        getDirectMessages();
      });

    });
