'use strict';
angular.module('main')
    .factory('NetworkMonitor', function ($rootScope, $cordovaNetwork) {

      return {
        isOnline: function () {
          if (ionic.Platform.isWebView()) {
            return $cordovaNetwork.isOnline();
          } else {
            return navigator.onLine;
          }
        },

        isOffline: function () {
          if (ionic.Platform.isWebView()) {
            return !$cordovaNetwork.isOnline();
          } else {
            return !navigator.onLine;
          }
        },

        startWatching: function () {
          if (ionic.Platform.isWebView()) {

            $rootScope.$on('$cordovaNetwork:online', function (event) {
              $rootScope.$broadcast('ConnectivityMonitor.connected', event);
            });

            $rootScope.$on('$cordovaNetwork:offline', function (event) {
              $rootScope.$broadcast('ConnectivityMonitor.disconnected', event);

            });

          } else {

            window.addEventListener('online', function (event) {
              $rootScope.$broadcast('ConnectivityMonitor.connected', event);
            }, false);

            window.addEventListener('offline', function (event) {
              $rootScope.$broadcast('ConnectivityMonitor.disconnected', event);
            }, false);
          }
        }
      };
    });
