'use strict';
angular.module('main')
    .controller('OrderDetailController', function ($scope, $state, $ionicLoading, $cordovaNativeAudio, AppModalService, MessageService, ProfileService, CartService, ImageService, VenueService, userOrder, DateFormatter, AppGlobals, $log) {
      var vm = this;
      vm.messengerCount = 0;
      //exports
      vm.cancelOrder = cancelOrder;
      vm.orderComplete = orderComplete;
      vm.displayMessenger = displayMessenger;

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

      function cancelOrder () {
        cancelOrderConfirm();
      }
      function displayMessenger () {
        vm.messengerCount = 0;
        var templateUrl = './main/templates/messenger/messenger.modal.view.html';
        AppModalService.show(templateUrl, 'MessengerController as messengerController', {username: vm.username, avatar: vm.profilePic})
                .then(function (result) {
                  $log.log('SingleRequestCtrl - displayMessenger - modal closing ', result);
                }, function (err) {
                  $log.log('displayMessenger error ', err);
                });
      }
      function orderComplete () {
        var templateUrl = './main/templates/orders/orders.complete.modal.view.html';
        AppModalService.show(templateUrl, 'OrderCompleteController as orderCompleteController')
                .then(function (result) {
                  switch (result.value) {
                    case 0:
                      break;
                    case 1:
                    case 2:
                    case 3:
                      var msgObj = {
                        status: 'completed',
                        statusMsg: result.msg
                      };
                      archiveOrder(msgObj);
                      $log.log('SingleRequestCtrl - msgObj ', msgObj);

                      MessageService.setDirectMessageStaffById(msgObj, AppGlobals.getDirectChannelId()).then(function () {
                        $log.log(' SingleRequestCtrl -setDirectMessageStaffById : saved');
                        //remove order
                        vm.unwatch();
                        MessageService.removeDirectMessageById(AppGlobals.getDirectChannelId());
                        AppGlobals.getDirectChannelId(null);
                        $state.go('orders', {channelId: AppGlobals.getVenueChannelId() });
                      }, function (error) {
                        //handle the error
                        $log.log('error', error);
                      });
                      break;
                    default:
                        //do nothing
                  }
                }, function (error) {
                  //handle the error
                  $log.log('orderComplete error ', error);
                });
      }
      function cancelOrderConfirm () {
        var templateUrl = './main/templates/orders/orders.cancel.modal.view.html';
        AppModalService.show(templateUrl, 'CancelOrderModalController as cancelOrderModalController')
              .then(function (result) {
                $log.log('cancelOrderConfirm - modal closing ', result);
                switch (result.value) {
                  case 0:
                    break;
                  case 1:
                  case 2:
                  case 3:
                  case 4:
                    //send message to user with reason value
                    var staffObj = {
                      status: 'canceled',
                      statusMsg: result.msg
                    };
                    archiveOrder(staffObj);
                    $log.log('SingleRequestCtrl - staffObj ', staffObj);
                    MessageService.setDirectMessageStaffById(staffObj, AppGlobals.getDirectChannelId()).then(function () {
                      $log.log(' SingleRequestCtrl -setDirectMessageStaffById : saved');
                       //stop watching message
                      vm.unwatch();
                      MessageService.removeDirectMessageById(AppGlobals.getDirectChannelId());
                      AppGlobals.getDirectChannelId(null);
                      $state.go('orders', {channelId: AppGlobals.getVenueChannelId() });
                    }, function (error) {
                      $log.log('Error:', error);
                    });
                    break;
                  default:
                        //do nothing
                }
              }, function (error) {
                $log.log('cancelOrderConfirm error ', error);
              });
      }
      //candidate to refactor - turn into an archive service
      function archiveOrder (inObj) {
        var obj = CartService.getAcceptedOrder();
        var currentTime =  DateFormatter.formatAMPM();
        var todaysDate =  DateFormatter.formatMMDDYYYY();
        var day = DateFormatter.formatDD();
        var month = DateFormatter.formatMM();
        var year = DateFormatter.formatYYYY();
        var orderTotal = CartService.getOrderTotal(obj.order);
        var order = {
          vid: AppGlobals.getVenueId(),
          sid: AppGlobals.getUserId(),
          uid: obj.uId,
          userOrder: obj.order,
          orderStatus: inObj.status,
          orderAction: inObj.statusMsg,
          transTime: currentTime,
          transDate: todaysDate,
          transTotal: orderTotal,
          m: month,
          d: day,
          yr: year,
          directMessage: ''
        };
        var messages = MessageService.forDirectMessage(AppGlobals.getDirectChannelId());
        messages.$loaded( function (msgs) {
          order.directMessage = msgs;
          VenueService.archiveVenueOrder(order);
          if (inObj.status === 'completed') {
            ProfileService.archivePatronsOrder(order);
          }
        }, function (error) {
           //handle error
          $log.log('forDirectMessage : error ', error);
        });

      }
      function removeItemFromVenueOrders () {
        $log.log('removeItemFromVenueOrders -getVenueChannelId : ', AppGlobals.getVenueChannelId(), 'order id ', AppGlobals.getOrderId() );
        MessageService.removeMessageById(AppGlobals.getVenueChannelId(), AppGlobals.getOrderId());
      }
      function sendStaffInfo () {
        $log.log('sendAcceptMessage ');
        vm.directMessage = MessageService.getDirectMessageById(AppGlobals.getDirectChannelId());
        vm.directMessage.$loaded().then(function () {
          $log.log('singleRequestCtrl - loaded direct message record : ', vm.directMessage.$id);
          vm.unwatch = vm.directMessage.$watch(function () {
            var msgObj = vm.directMessage.messages;
            var lastObj = msgObj[Object.keys(msgObj)[Object.keys(msgObj).length - 1]];
            if (lastObj) {
              $log.log('vm.directMessage.messages array ', lastObj.role);
              if (lastObj.role === 1) {
                if (vm.isWebView) {
                  $log.log('play sound');
                  $cordovaNativeAudio.play('notification');
                }
                if (!vm.messengerOpen) {
                  vm.messengerCount++;
                }
              }
            }

          });

          sendAcceptedmessage();

        });
      }
      function sendAcceptedmessage () {
        var staffObj = {
          staffName: AppGlobals.getUserName(),
          staffAvatar: AppGlobals.getUserAvatar(),
          status: 'accepted'
        };
        $log.log('staffObj ', staffObj);
        MessageService.setDirectMessageStaffById(staffObj, AppGlobals.getDirectChannelId()).then(function () {
          $log.log('setDirectMessageStaffById : saved');
        }, function (error) {
          $log.log('Error:', error);
        });
      }
      function setDirectMessagingData () {
        var staffObj = {
          staffName: AppGlobals.getUserName(),
          staffAvatar: AppGlobals.getUserAvatar(),
          status: 'accepted'
        };
        $log.log('staff accepts order obj : ', staffObj, 'getDirectChannelId ', AppGlobals.getDirectChannelId());
        MessageService.setDirectMessageStaffById(staffObj, AppGlobals.getDirectChannelId()).then(function () {
          $log.log('setDirectMessageStaffById : saved');
        }, function (error) {
          $log.log('Error:', error);
        });
      }
      function getUserData () {

        ProfileService.getPatronProfileById(userOrder.uId)
              .then(function (data) {
                $log.log(data);
                vm.username = data.firstName;
                vm.profilePic = vm.profilePic = ImageService.resizeImage(data.profilePicUrl, {
                  width: 600,
                  height: 400,
                  blur: true
                });
              }, function (err) {
                $log.log('getUserData error ', err);
              });
      }
      $scope.$on('$ionicView.enter', function () {
        getUserData();
        CartService.setAcceptedOrder(userOrder);
        AppGlobals.setDirectChannelId(userOrder.uChannel);
        setDirectMessagingData();
        vm.orders = userOrder.order;
        removeItemFromVenueOrders();
        sendStaffInfo();
      });

    });
