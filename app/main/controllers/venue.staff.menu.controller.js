'use strict';
angular.module('main')
    .controller('VenueStaffMenuController', function ($scope, $state, $ionicLoading, menu, AppGlobals, LoginService) {
      var vm = this;
      //exports
      vm.logIn = logIn;
      vm.navigateTo = navigateTo;

      function navigateTo (str) {
        switch (str) {
          case 'profile':
            $state.go('staff', {uId: AppGlobals.getUserId()});
            break;
          case 'dashboard':
            $state.go('dashboard', {uId: AppGlobals.getUserId()});
            break;
          default:
        }
      }
      function logIn () {
        if (!AppGlobals.isLoggedIn()) {
          LoginService.displayLogIn().then( function (res) {
            switch (res) {
              case 'signin-success':
                AppGlobals.setLoggedIn(true);
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
          $ionicLoading.show({
            template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Logging Out..'
          });
          vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        }
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();

      });

    });