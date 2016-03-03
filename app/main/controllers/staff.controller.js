'use strict';
angular.module('main')
    .controller('ProfileController', function ($scope, $state, $ionicLoading, $ionicHistory, profile, AppGlobals, LoginService, ImageService) {
      var vm = this;
      //exports
      vm.edit = edit;
      vm.logIn = logIn;
      vm.goBack = goBack;
      function goBack () {
        $ionicHistory.goBack();
      }
      function edit () {
        vm.editActive = !vm.editActive;
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
        vm.user = profile;
        vm.profilePic = ImageService.resizeImage(vm.user.profilePicUrl, {
          width: 600,
          height: 400,
          blur: true
        });
        vm.editActive = false;
      });

    });
