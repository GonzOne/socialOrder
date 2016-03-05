'use strict';
angular.module('main')
    .controller('VenueMenuController', function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, AppGlobals, CartService, AppModalService, LoginService, SmsService, MessageService, VenueService, menu, $cordovaNativeAudio, $cordovaLocalNotification, $cordovaVibration, $cordovaBadge, $log) {
      var vm = this;
      vm.messengerCount = 0;
      vm.messengerOpen = false;
      //exports
      vm.logIn = logIn;
      vm.sendSms = sendSms;
      vm.displayMessenger = displayMessenger;
      vm.navigateToProfile = navigateToProfile;

      ionic.Platform.ready(function () {
        $log.log('ionic.Platform.ready : web view ', AppGlobals.isWebView());
        vm.isWebView = ionic.Platform.isWebView();
        if (vm.isWebView) {

          $cordovaNativeAudio.preloadSimple('notification', '/main/assets/audio/notification.wav')
                    .then(function (msg) {
                      $log.log('$cordovaNativeAudio.preloadSimple ', msg);
                    }, function ( error) {
                      $log.log('$cordovaNativeAudio.preloadSimple ', error);
                    });
          $cordovaNativeAudio.preloadSimple('accept', '/main/assets/audio/accept.wav')
                    .then(function (msg) {
                      $log.log('$cordovaNativeAudio.preloadSimple ', msg);
                    }, function ( error) {
                      $log.log('$cordovaNativeAudio.preloadSimple ', error);
                    });
        }
      });
      function navigateToProfile () {
        if (vm.isUserLoggedIn) {
          $state.go('profile', {uId: AppGlobals.getUserId()});
        } else {
          showAuthPrompt();
        }
      }
      function displayMessenger () {
        $log.log('displayMessenger ');
        vm.messengerCount = 0;
        vm.messengerOpen = true;
        var templateUrl = './main/templates/messenger/messenger.modal.view.html';
        AppModalService.show(templateUrl, 'MessengerController as messengerController', {username: AppGlobals.getStaffName(), avatar: AppGlobals.getStaffAvatar()})
                .then(function (result) {
                  $log.log('SingleRequestCtrl - displayMessenger - modal closing ', result);
                  vm.messengerOpen = false;
                }, function (err) {
                  $log.log('displayMessenger error ', err);
                });
      }
      function sendSms () {
        SmsService.sendSmsInvite();
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
          $ionicLoading.show({
            template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Logging Out..',
            duration: 2000
          });
          vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        }
      }
      function showAuthPrompt () {
        var loginPopup = $ionicPopup.alert({
          title: 'OOPS!',
          template: '<span>You need to Sign in or Sign Up to access your profile!</span>'
        });
        loginPopup.then(function () {
          displayLogin();
        });
      }
      function displayLogin () {
        LoginService.displayLogIn().then(function (res) {
          switch (res) {
            case 'signin-success':
              AppGlobals.setLoggedIn(true);
              vm.isUserLoggedIn = AppGlobals.isLoggedIn();
              $state.go('profile', {uId: AppGlobals.getUserId()});
              break;
            case 'signup':
              $state.go('create');
              break;
            case 'password-reset':
              $state.go('password_reset');
              break;
          }
        });
      }
      function aquireServer () {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Aquiring Server..'
        });
        /*
        we should time out TBD.
        $timeout(function () {
          $ionicLoading.hide();

        }, 6000).then(function () {
              // You know the timeout is done here
        });
        */
        vm.directMessage = MessageService.getDirectMessageById(AppGlobals.getDirectChannelId());
        vm.directMessage.$loaded().then(function () {
          vm.unwatch = vm.directMessage.$watch(function () {

            $log.log('vm.directMessage', vm.directMessage);
            $log.log('vm.directMessage : status', vm.directMessage.status);

            switch (vm.directMessage.status) {
              case 'accepted':
                if (!vm.serverAccepted) {
                  vm.serverAccepted = true;
                  $ionicLoading.hide();
                  $ionicLoading.show({
                    template: 'Order accepted!',
                    duration: 2000
                  });

                  AppGlobals.setOrderStatus('accepted');
                  AppGlobals.setStaffName(vm.directMessage.staffName);
                  AppGlobals.setStaffAvatar(vm.directMessage.staffAvatar);
                  CartService.setAcceptedOrder(CartService.getPendingOrder());
                  CartService.clearPendingOrder();

                  if (vm.isWebView) {
                    $cordovaVibration.vibrate(100);
                    $cordovaNativeAudio.play('accept');
                    $cordovaLocalNotification.schedule({
                      id: 1,
                      text: 'Your items will be with you shortly!',
                      title: 'Order Status - ACCEPTED'
                    }).then(function () {
                      $log.log('The notification has been set');
                    });
                    $cordovaBadge.hasPermission().then(function () {
                      $cordovaBadge.set(1).then( function () {
                        $log.log('$cordovaBadge : badge set ! ');
                        AppGlobals.setBadge(true);
                      }, function (err) {
                        $log.log('$cordovaBadge ', err);
                        AppGlobals.setBadge(false);
                      });
                    });
                  }
                }
                if (vm.directMessage.messages) {
                  $log.log('we got messages');
                  var msgObj = vm.directMessage.messages;
                  var lastObj = msgObj[Object.keys(msgObj)[Object.keys(msgObj).length - 1]];
                  if (lastObj) {
                    $log.log('vm.directMessage.messages array ', lastObj.role);
                    if (lastObj.role === 2) {
                      if (vm.isWebView) {
                        $log.log('play sound');
                        $cordovaNativeAudio.play('notification');
                        $cordovaLocalNotification.schedule({
                          id: 4,
                          text: 'You have a message from ' + vm.venueName,
                          title: 'Order Status - MESSAGE'
                        }).then(function () {
                          $log.log('The notification has been set');
                        });
                        $cordovaBadge.hasPermission().then(function () {
                          $cordovaBadge.increase(1).then(function () {
                            $log.log('$cordovaBadge : badge set ! ');
                            AppGlobals.setBadge(true);
                          }, function (err) {
                            $log.log('$cordovaBadge ', err);
                            AppGlobals.setBadge(false);
                          });
                        });

                      }
                      $log.log('vm.messengerOpen ', vm.messengerOpen);
                      if (!vm.messengerOpen) {
                        vm.messengerCount++;
                      }
                      $log.log('vm.messengerCount ', vm.messengerCount);
                    }
                  }
                }
                break;
              case 'canceled':
                $ionicLoading.show({
                  template: 'ORDER CANCELED<br>' + vm.directMessage.statusMsg,
                  duration: 6000
                });

                if (vm.isWebView) {
                  $log.log('play sound');
                  $cordovaVibration.vibrate(100);
                  $cordovaNativeAudio.play('accept');
                  $cordovaLocalNotification.schedule({
                    id: 2,
                    text: vm.directMessage.statusMsg,
                    title: 'Order Status - CANCELED'
                  }).then(function () {
                    $log.log('The notification has been set');
                  });
                  $cordovaBadge.hasPermission().then(function () {
                    $cordovaBadge.increase(1).then(function () {
                      $log.log('$cordovaBadge : badge set ! ');
                      AppGlobals.setBadge(true);
                    }, function (err) {
                      $log.log('$cordovaBadge ', err);
                      AppGlobals.setBadge(false);
                    });
                  });
                }

                vm.unwatch();
                CartService.clearAcceptedOrder();
                AppGlobals.setOrderStatus(null);
                vm.hasOrders = false;
                vm.serverAccepted = false;
                if (vm.directMessage.messages) {
                  clearDirectMessage();
                }

                break;
              case 'completed':
                $log.log('WTF');
                $ionicLoading.show({
                  template: 'ORDER COMPLETED<br>' + vm.directMessage.statusMsg,
                  duration: 6000
                });

                if (vm.isWebView) {
                  $cordovaVibration.vibrate(100);
                  $cordovaNativeAudio.play('accept');
                  $cordovaLocalNotification.schedule({
                    id: 3,
                    text: vm.directMessage.statusMsg,
                    title: 'Order Status - COMPLETED'
                  }).then(function () {
                    $log.log('The notification has been set');
                  });
                  $cordovaBadge.hasPermission().then(function () {
                    $cordovaBadge.increase(1).then(function () {
                      $log.log('$cordovaBadge : badge set ! ');
                      AppGlobals.setBadge(true);
                    }, function (err) {
                      $log.log('$cordovaBadge ', err);
                      AppGlobals.setBadge(false);
                    });
                  });
                }

                vm.unwatch();
                AppGlobals.setOrderStatus(null);
                vm.hasOrders = false;
                vm.serverAccepted = false;
                if (vm.directMessage.messages) {
                  clearDirectMessage();
                }
                break;
              default:
            }

          });

        });
      }
      function clearDirectMessage () {
        $log.log('orderCtrl - clearDirectMessage', AppGlobals.getDirectChannelId());
        MessageService.removeDirectMessageById(AppGlobals.getDirectChannelId());
        vm.messengerCount = 0;
        vm.directMessage = null;
        vm.server = {};
        AppGlobals.clearDirectChannelId();
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
        if (AppGlobals.getOrderStatus() === 'pending') {
          vm.hasOrders = true;
          aquireServer();
        }
        vm.menu = menu;
        vm.menuItems = displayArray(menu.menu);
        vm.lastUpdate = menu.lastUpdate;
        vm.serverAccepted = false;
        VenueService.getVenueName(menu.venue_id).then( function (str) {
          vm.venueName = str;
        });

      });

    });
