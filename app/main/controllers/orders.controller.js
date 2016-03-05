'use strict';
angular.module('main')
    .controller('OrdersController', function ($scope, orders, $state, AppGlobals, $cordovaVibration, $cordovaNativeAudio,  LoginService, MessageService, $log) {
      var vm = this;
      vm.orders = orders;
      $log.log('orders ', orders, ' vm ', vm);
      //exports
      vm.logIn = logIn;
      vm.cancelItem = cancelItem;
      vm.navigateTo = navigateTo;
      vm.acceptOrder = acceptOrder;

      ionic.Platform.ready(function () {
        vm.isWebView = ionic.Platform.isWebView();
        if (vm.isWebView) {
          $cordovaNativeAudio.preloadSimple('notification', '/main/assets/audio/notification.wav')
                    .then(function (msg) {
                      $log.log('$cordovaNativeAudio.preloadSimple ', msg);
                    }, function ( error) {
                      $log.log('$cordovaNativeAudio.preloadSimple ', error);
                    });
        }
      });

      function acceptOrder (indx) {
        var msg = vm.orders[indx];
        AppGlobals.setOrderId(msg.$id);
        $state.go('order-details', {orderId: msg.$id, channelId: AppGlobals.getVenueChannelId()});
      }
      function logIn () {
        if (!AppGlobals.isLoggedIn()) {
          LoginService.displayLogIn().then( function (res) {
            switch (res) {
              case 'signin-success':
                vm.isUserLoggedIn = AppGlobals.isLoggedIn();
                break;
              case 'signup':
                $state.go('signup');
                break;
              case 'password-reset':
                $state.go('password_reset');
                break;
            }
          });

        } else {
          LoginService.logOut();
          vm.isUserLoggedIn = AppGlobals.isLoggedIn();
          $state.go('main');
        }
      }
      function cancelItem () {

      }
      function navigateTo (str) {
        switch (str) {
          case 'home':
            $state.go('dashboard', {uId: AppGlobals.getUserId()});
            break;
          case 'profile':
            $state.go('staff', {uId: AppGlobals.getUserId()});
            break;
          default:
        }
      }
      function watchOrders () {
        vm.unwatch = vm.orders.$watch(function () {
          if (vm.isWebView) {
            $cordovaVibration.vibrate(100);
            $cordovaNativeAudio.play('notification');
          }
        });
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        watchOrders();
      });
      $scope.$on('$ionicView.beforeLeave', function () {
        vm.unwatch();
      });
    });
