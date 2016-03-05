'use strict';
angular.module('main')
    .controller('VenueStaffMenuItemController', function ($scope, $state, $ionicLoading, items, AppGlobals, LoginService) {
      var vm = this;
      //exports
      vm.navigateTo = navigateTo;
      vm.logIn = logIn;

      function navigateTo (str) {
        switch (str) {
          case 'menu':
            $state.go('staff-menu', {menuId: AppGlobals.getMenuId()});
            break;
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
            template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Logging Out..',
            duration: 2000
          });
          vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        }
      }
      function displayArray (menuObj) {
        var menuArray = [];
        Object.keys(menuObj).forEach(function (key) {
          if (typeof(menuObj[key]) === 'object' ) {
            menuArray.push(menuObj[key]);
          }
        });
        return menuArray;
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        vm.typeLabel =  items.displayName;
        vm.items =  displayArray(items.items);
      });
      $scope.$on('$ionicView.afterLeave', function () {
        vm.isUserLoggedIn = null;
        vm.typeLabel = null;
        vm.items =  null;
      });

    });
