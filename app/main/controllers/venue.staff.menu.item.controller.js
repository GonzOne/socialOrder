'use strict';
angular.module('main')
    .controller('VenueStaffMenuItemController', function ($scope, $state, items, AppGlobals) {
      var vm = this;
      //exports
      vm.navigateTo = navigateTo;

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

    });
