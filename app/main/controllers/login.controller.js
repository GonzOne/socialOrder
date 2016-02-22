'use strict';
angular.module('main')
    .controller('LoginController', function ($scope, $state, $ionicPopup, $ionicLoading, Auth, AppGlobals, localStorageService, ProfileService,  $log) {
      var vm = this;
      vm.user = {
        email: '',
        password: ''
      };
      //exports
      vm.login = login;
      vm.signup = signup;
      vm.resetPassword = resetPassword;

      function login () {
        $log.log('LoginController  ', vm.user);
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Signing in...'
        });
        Auth.$authWithPassword(vm.user).then(function (authData) {
          $log.log('auth ', authData);
          $ionicLoading.hide();
          AppGlobals.setUserId(authData.uid);
          AppGlobals.isLoggedIn(true);
          $log.log('user token ', authData.token);
          localStorageService.set('token', authData.token);
          ProfileService.getMetaProfileById(authData.uid)
                    .then(function (data) {
                      $log.log('data ', data);
                      $log.log('loginModalCtrl : data ROLE ', data.role);
                      AppGlobals.setLoggedIn(true);
                      AppGlobals.setUserRole(data.role);
                      switch (data.role) {
                        case 0:
                          break;
                        case 1:
                          getPatronProfile();
                          break;
                        case 2:
                          getStaffProfile();
                          $state.go('dashboard', {uId: data.uid});
                          break;
                        case 3:
                          break;
                        default:
                      }

                      $scope.closeModal('signin-success');


                    }, function (error) {
                      $log.log('Error:', error);
                      $scope.closeModal(false);
                    });

        }, function (error) {
          $ionicLoading.hide();
          var errorMsg;
          $log.log('error.code ', error.code);
          switch (error.code) {
            case 'INVALID_EMAIL':
              errorMsg = 'The specified user account email is invalid.';
              break;
            case 'INVALID_PASSWORD':
              errorMsg = 'The specified user account password is incorrect.';
              break;
            case 'INVALID_USER':
              errorMsg = 'The specified user account does not exist. Please Sign Up.';
              break;
            default:
              errorMsg = 'Invalid email address';
          }
          $ionicPopup.alert({
            title: 'SIGN IN ERROR',
            template: errorMsg
          });

        });
      }

      function signup () {
        $scope.closeModal('signup');
      }
      function resetPassword () {
        $scope.closeModal('password-reset');
      }

      function getPatronProfile () {
        ProfileService.getPatronProfileById(AppGlobals.getUserId()).then(function (data) {
          $log.log('getPatronProfileById :', data);
          AppGlobals.setUserName(data.firstName);
          AppGlobals.setUserAvatar(data.profilePicUrl);
        }, function (error) {
          $log.log('Error:', error);

        });
      }

      function getStaffProfile () {
        ProfileService.getStaffProfileById(AppGlobals.getUserId()).then(function (data) {
          $log.log('getStaffProfileById :', data);
          AppGlobals.setUserName(data.firstName);
          AppGlobals.setUserAvatar(data.profilePicUrl);
        }, function (error) {
          $log.log('Error:', error);

        });

      }

    });
