'use strict';
angular.module('main')
    .controller('DashboardController', function ($scope, $state, staff, AppModalService, LoginService, StaffService, VenueService, $ionicLoading, AppGlobals, $log) {
      var vm = this;
      vm.isUserLoggedIn;
      //exports
      vm.navigateTo = navigateTo;
      vm.logIn = logIn;
      vm.viewOrders = viewOrders;

      function navigateTo (str) {
        switch (str) {
          case 'profile':
            $state.go('staff', {uId: AppGlobals.getUserId()});
            break;
          case 'menu':
            $state.go('staff-menu', {menuId: AppGlobals.getMenuId()});
            break;
          default:
        }
      }
      function viewOrders () {
        $log.log('viewOrders ', AppGlobals.getVenueChannelId());
        $state.go('orders', {channelId: AppGlobals.getVenueChannelId()});
      }
      function logIn () {
        if (!AppGlobals.isLoggedIn()) {
          LoginService.displayLogIn().then( function (res) {
            switch (res) {
              case 'signin-success':
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
          $state.go('main');
        }
      }
      function getVenueList () {
        StaffService.getVenueListById(AppGlobals.getUserId()).then(function (list) {
          $log.log('returned venue list Array :', list);
          if (AppGlobals.getVenueId() === null) {
            staffCheckIn(list);
          }

        }, function (error) {
          $log.log('Error:', error);

        });
      }
      function staffCheckIn (list) {
            //get the venue data objets to display in the modal
        var len = list.length;
        var venues = [];
        for (var i = 0; i < len; i++) {
          VenueService.getVenueById(list[i].vId).then(function (data) {
            venues.push(data);
          }, function (error) {
            $log.log('Error:', error);
          });
        }

        var templateUrl = './main/templates/checkin/checkin.modal.view.html';
        AppModalService.show(templateUrl, 'CheckinController as checkinController', venues)
                .then(function (result) {
                  $log.log(' vm - modal closing ', result);
                }, function (err) {
                  $log.log('modal error ', err);
                });
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        $log.log(' $ionicView.enter AppGlobals.getVenueId() ', AppGlobals.getVenueId(), 'channel id ', AppGlobals.getVenueChannelId(), 'staff ', staff );
        AppGlobals.setUserName(staff.firstName);
        AppGlobals.setUserAvatar(staff.profilePicUrl);

        if (AppGlobals.getVenueId() === null) {
          getVenueList();
        }

      });

    });
