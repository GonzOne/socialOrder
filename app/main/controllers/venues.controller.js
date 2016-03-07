'use strict';
angular.module('main')
    .controller('VenuesController', function ($scope, Auth, $state, LoginService, $cordovaGeolocation, ProfileService, GoogleService, $ionicLoading, VenueService, AppGlobals, $ionicPopup, TokenAuth, $log) {
      var vm = this;
      vm.isVenueSelected = false;
      vm.isUserLoggedIn;
      vm.venuesReady = false;
      //exports
      vm.setVenue = setVenue;
      vm.logIn = logIn;

      function setVenue (indx) {
        var venue = vm.list[indx];
        $log.log('set venue ', venue, 'key ', venue.key, 'menu id', venue.menu_id, ' channel id ', venue.channel_id);
        AppGlobals.setVenueId(venue.key);
        AppGlobals.setMenuId(venue.menu_id);
        if (venue.channel_id) {
          AppGlobals.setVenueChannelId(venue.channel_id);
        }
        $state.go('menu', {menuId: venue.menu_id});
      }
      function logIn () {
        $log.log('logIn ', AppGlobals.isLoggedIn());
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

      function checkUserToken () {
        LoginService.checkCredentials().then( function () {
          vm.isUserLoggedIn = AppGlobals.isLoggedIn();
          ProfileService.getMetaProfileById(AppGlobals.getUserId())
                  .then(function (data) {
                    AppGlobals.setUserRole(data.role);
                    $log.log('checkUserToken', data.role);
                    switch (data.role) {
                      case 2:
                        $ionicLoading.hide();
                        $state.go('dashboard', {uId: AppGlobals.getUserId()});
                        break;
                      default:
                    }

                  }, function (error) {
                    $log.log('Error:', error);
                  });

        }, function (error) {
          $log.log('checkCredentials failed:', error);
        });
      }
      function locationError () {
        var locationErrorPopup = $ionicPopup.show({
          template: 'We could not detect your location. <br> Please select a venue.',
          title: 'OOPS!',
          subTitle: 'Locator Error!',

          scope: $scope,
          buttons: [ { text: 'OK', onTap: function () { return false; } }]
        });
        locationErrorPopup.then(function (res) {
          $log.log('locationErrorPopup - close!', res);
        });
      }

      function getUsersLocation () {
        $log.log('venuesCtrl - getUsersLocation ');
        vm.list = null;
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Acquiring your location...'
        });
        var options = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation.getCurrentPosition(options)
            .then( function (position) {
              $log.log('postion - lat : ', position.coords.latitude, 'lng : ', position.coords.longitude);
              var latLngObj = {lat: position.coords.latitude, lng: position.coords.longitude};
              AppGlobals.setUserLatLng(latLngObj);
              GoogleService.getPostalCodeForLatLng(latLngObj).then(function (zipcode) {
                $log.log('VenuesController - getPostalCodeForLatLng returned : ', zipcode);
                AppGlobals.setUserZipcode(zipcode);
                vm.userZipcode = zipcode;
                displayVenuesinPostalCode(zipcode);
              }, function (error) {
                $log.log('VenuesController - getPostalCodeForLatLng returned : error', error);
                locationError();
                $ionicLoading.hide();
                listAllVenues();
              });

            }, function (err) {
              $log.log('error : ', err);
              $ionicLoading.hide();
              locationError();
              listAllVenues();
            });
      }

      function listAllVenues () {
        $log.log('VenuesCtrl -  listAllVenues');
        var list = VenueService.getAllVenues();
        var len = list.length;
        var venues = [];
        for (var i = 0; i < len; i++) {
          $log.log(list[i]);
          if ( list[i].active === 1) {
            venues.push(list[i]);
          }
        }
        vm.list = venues;
        vm.venuesReady = true;
      }

      function displayVenuesinPostalCode (zipcode) {
        $log.log('VenuesCtrl -  displayVenuesinPostalCode ', zipcode);

        VenueService.getVenuesByZip(zipcode).then(function (venues) {
          $log.log('VenuesCtrl -  getVenuesByZip returned : ', venues);
          var len = venues.length;
          $log.log('len ', len);
          if (len === 0) {
            listAllVenues();

          } else {
            vm.list = venues;
            vm.venuesReady = true;

          }
          $ionicLoading.hide();
        }, function (error) {
          $log.log('error', error);

        });
      }

      $scope.$on('$ionicView.enter', function () {
        checkUserToken();
        getUsersLocation();

      });
      $scope.$on('$ionicView.leave', function () {
        vm.venuesReady = null;
        vm.list = null;
      });

    });
