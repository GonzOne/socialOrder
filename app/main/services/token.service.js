'use strict';
angular.module('main')
    .factory('TokenAuth', function ($q, localStorageService, Auth, AppGlobals, $log) {
      return {
        isSessionValid: function () {
          $log.log('TokenAuth : checking session ');
          var deferred = $q.defer();
          var token = localStorageService.get('token');
          Auth.$authWithCustomToken(token).then(function (authData) {
            $log.log('TokenAuth - Logged in as:', authData);
            AppGlobals.setUserId(authData.uid);
            deferred.resolve(authData);
          }).catch(function (error) {
            $log.log('Authentication failed:', error);
            AppGlobals.isLoggedIn(false);
            deferred.reject();
          });

          return deferred.promise;
        },
        clearSession: function () {
          localStorageService.remove('token');
        }
      };

    });
