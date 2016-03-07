'use strict';
angular.module('main')
    .factory('LoginService', function ($q, $state, TokenAuth, AppGlobals, Auth, AppModalService, $log) {

      var checkCredentials = function  () {
        var deferred = $q.defer();
        TokenAuth.isSessionValid().then(function (aData) {
          $log.log('LoginService : checkCredentials - Valid Token available');
          AppGlobals.setUserId(aData.uid);
          AppGlobals.setLoggedIn(true);
          deferred.resolve();
        }).catch(function () {
          deferred.reject();
        });
        return deferred.promise;
      };
      var displayLogIn = function () {
        var deferred = $q.defer();
        var templateUrl = './main/templates/login/login.modal.view.html';
        AppModalService.show(templateUrl, 'LoginController as loginController')
                .then(function (res) {
                  deferred.resolve(res);
                }, function (err) {
                  $log.log('modal error ', err);
                  deferred.reject();
                });
        return deferred.promise;
      };

      var logOut = function () {
        AppGlobals.setLoggedIn(false);
        Auth.$unauth();
        TokenAuth.clearSession();
        AppGlobals.logOut();
        $state.go('main');

      };

      return {
        checkCredentials: checkCredentials,
        displayLogIn: displayLogIn,
        logOut: logOut

      };
    });
