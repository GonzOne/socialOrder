'use strict';
angular.module('main')
    .controller('CheckinController', function ($scope, $log, parameters, AppGlobals, VenueService, MessageService ) {
      var vm = this;
      vm.list = parameters;
      $log.log(vm);
        //exports
      vm.setVenue = setVenue;

      function setVenue (indx) {
        var selectedVenue = vm.list[indx];
        $log.log('set venue ', selectedVenue);
        AppGlobals.setVenueId(selectedVenue.key);
        $log.log('channel_id ', selectedVenue.channel_id);
        if (selectedVenue.channel_id) {
          AppGlobals.setVenueChannelId(selectedVenue.channel_id);
        } else {
          createChannel();
        }

        $scope.closeModal(true);
      }
      function addChannelIdToVenue (key) {
        VenueService.setVenueChannelId(AppGlobals.getVenueId(), key).then(function () {
          $log.log('setVenueChannelId success');
        }, function (error) {
          $log.log('setVenueChannelId : error ', error);
        });
      }

      function createChannel () {
        VenueService.getVenueChannelId(AppGlobals.getVenueId()).then(function (key) {
          $log.log('getVenueChannelId success : key ', key);
          if (key) {
            $log.log('we have a channelId ', key);
            AppGlobals.setVenueChannelId(key);
                    /*
                    //move to rders controller
                    vm.messages = MessageService.forVenue(key);
                    $log.log('vm.messages : ', vm.messages);
                    vm.messages.$watch(function (event) {
                        $log.log('new order ', event, ' len ', vm.messages.length);
                        if (vm.isWebView && !vm.next) {
                            $cordovaNativeAudio.play('accept');
                        }
                    });
                    */
          } else {
            MessageService.createVenueChannel().then(function (key) {
              $log.log('createVenueChannel success : key ', key);
              AppGlobals.setVenueChannelId(key);
              addChannelIdToVenue(key);

            }, function (error) {
              $log.log('createChannel : error ', error);
            });
          }

        }, function (error) {
          $log.log('createChannel : error ', error);
        });
      }

    });
