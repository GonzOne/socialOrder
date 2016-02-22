'use strict';
angular.module('main')
    .controller('CheckoutController', function ($scope, $state, parameters, $ionicPopup, $ionicLoading, AppGlobals, VenueService, LoginService, MessageService, CartService, $log) {
      var vm = this;
      vm.items = parameters;
      vm.total;
      //exports
      vm.submitOrder = submitOrder;

      function submitOrder () {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Submiting Order...'
        });

        if (!AppGlobals.isLoggedIn()) {
          $ionicLoading.hide();
          showAuthPrompt();
        } else {
          CartService.setPendingOrder(CartService.getUserOrder());
          CartService.clearOrder();
          sendOrder();
        }
      }
      function displayLogin () {
        LoginService.displayLogIn().then(function (res) {
          switch (res) {
            case 'signin-success':
              AppGlobals.setLoggedIn(true);
              vm.isUserLoggedIn = AppGlobals.isLoggedIn();
              CartService.setPendingOrder(CartService.getUserOrder());
              CartService.clearOrder();
              sendOrder();
              break;
            case 'signup':
              $state.go('signup');
              break;
            case 'password-reset':
              $state.go('password_reset');
              break;
          }
        });
      }
      function sendOrder () {
            // check if venue has a channel_id
        $log.log('sendOrder');
        VenueService.getVenueChannelId(AppGlobals.getVenueId()).then(function (key) {
          $log.log(' submitOrder- getVenueChannelId success : key ', key);
          if (key) {
            AppGlobals.setVenueChannelId(key);
            var dm = {
              staffName: '',
              staffAvatar: '',
              messages: '',
              status: 'pending'
            };
            MessageService.createDirectChannel(dm).then(function (dChannel) {
              AppGlobals.setDirectChannelId(dChannel);
              var order = {
                uId: AppGlobals.getUserId(),
                uAvatar: AppGlobals.getUserAvatar(),
                uName: AppGlobals.getUserName(),
                uChannel: dChannel,
                order: CartService.getPendingOrder(),
                orderStatus: 'pending'
              };

              MessageService.sendMessage(AppGlobals.getVenueChannelId(), order);

              AppGlobals.setOrderStatus('pending');
              $ionicLoading.hide();
              $state.go('menu', {menuId: AppGlobals.getMenuId()});
              $scope.closeModal();
            }, function (error) {
              $log.log('createDirectChannel : error ', error);
            });

          } else {
                    //display venue is not online
            $log.log('on one is online');
          }

        }, function (error) {
          $log.log('getVenueChannelId : error ', error);

        });
      }
      function showAuthPrompt () {
        var loginPopup = $ionicPopup.alert({
          title: 'OOPS!',
          template: '<span>You need to Sign in or Sign Up to use Social Order!</span><br>It will only take a few seconds.'
        });
        loginPopup.then(function () {
          displayLogin();
        });
      }
      function displayTotal (array) {
        var len = array.length;
        var a = [];
        for (var i = 0; i < len; i++) {
          a.push(parseFloat(array[i].cost));
        }
        var sum = a.reduce(function (a, b) { return a + b; }, 0);
        $log.log(sum);
        vm.total = sum;
      }
      displayTotal(vm.items);


    });
