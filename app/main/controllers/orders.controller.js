'use strict';
angular.module('main')
    .controller('OrdersController', function ($scope, orders, $state, AppGlobals, LoginService, MessageService, $log) {
      var vm = this;
      vm.isUserLoggedIn;
      vm.orders = orders;
      $log.log('orders ', orders, ' vm ', vm);
      //exports
      vm.logIn = logIn;
      vm.cancelItem = cancelItem;
      vm.navigateTo = navigateTo;
      vm.acceptOrder = acceptOrder;


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
            //navigate to staff profile
            break;
          default:
        }
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();
      });
    });
