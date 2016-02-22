'use strict';
angular.module('main')
    .controller('MapController', function ($scope, $state, $location, $anchorScroll, venues, $ionicLoading, GoogleService, VenueService, LoginService, NgMap, AppGlobals) {
      var vm = this;
      vm.isUserLoggedIn;
      vm.map;
      //exports
      vm.logIn = logIn;
      vm.centerMap = centerMap;

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
          vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        }
      }
      function displayInfo (key) {
        VenueService.getVenueById(key).then(function (venue) {
          vm.venue = venue;
          var latLng = {lat: venue.lat, lng: venue.lng};
          GoogleService.getDistance(AppGlobals.getUserLatLng(), latLng).then(function (results) {
            vm.distanceToVenue = results.distance;
          });
        });
        $location.hash('menu_button');
        $anchorScroll();
      }
      function centerMap () {
        vm.venue = null;
        vm.distanceToVenue = null;
        GoogleService.panToBounds(vm.map);
        $location.hash('map_top');
        $anchorScroll();
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        vm.zipcode = AppGlobals.getUserZipcode();
        vm.venue = null;
        vm.distanceToVenue = null;
        NgMap.getMap().then(function (map) {
          vm.map = map;
          GoogleService.addMarkers(venues, map, displayInfo);
        });
      });
      $scope.$on('$ionicView.beforeLeave', function () {
        centerMap();
      });
    });
