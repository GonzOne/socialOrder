'use strict';
angular.module('main')
    .factory('SmsService', function ($cordovaContacts, $cordovaSms, $cordovaDialogs, AppGlobals, VenueService, $log) {
      this.phoneNum;
      function getPhoneNumber (c) {
        var bool = false;
        if (c.phoneNumbers && c.phoneNumbers.length) {
          bool = true;
        }
        return bool;
      }
      function inviteFriends () {
        $log.log('inviteFriends ');
        /*
        if (window.cordova && window.cordova.plugins.addressbook) {
          window.cordova.plugins.addressbook.getAsync(function (contact) {
            $log.log('contact.length ', contact.length);
            if (getPhoneNumber(contact)) {
                  //store data
              $log.log('contact ', contact)
              sendSms(contact);
            } else {
              $log.log('NO PHONE NUMBER');
              var msg = 'The selected contact does not have a valid phone number. Please select a different contact.';                 $cordovaDialogs.confirm(msg, 'Warning', ['OK', 'Cancel'])
                      .then(function (buttonIndex) {
                          // no button = 0, 'OK' = 1, 'Cancel' = 2
                        if (buttonIndex === 1) {
                          inviteFriends();
                        }

                      });
            }
          }, function (error) {
            $log.log('plug in failed ', error);
          })
        }
        */

        $cordovaContacts.pickContact().then(function (contact) {
          if (getPhoneNumber(contact)) {
            //store data
            $log.log('contact ', contact);
            sendSms(contact);
          } else {
            $log.log('NO PHONE NUMBER');
            var msg = 'The selected contact does not have a valid phone number. Please select a different contact.';
            $cordovaDialogs.confirm(msg, 'Warning', ['OK', 'Cancel'])
                        .then(function (buttonIndex) {
                            // no button = 0, 'OK' = 1, 'Cancel' = 2
                          if (buttonIndex === 1) {
                            inviteFriends();
                          }

                        });
          }

        }, function (err) {
          $log.log('Error: ' + err);
        });

      }

      function sendSms (c) {
        $log.log('sendSms ', c);
        var options = {
          replaceLineBreaks: false, // true to replace \n by a new line, false by default
          android: {
            intent: '' // send SMS with the native android SMS messaging
            //intent: '' // send SMS without open any other app
            //intent: 'INTENT' // send SMS inside a default SMS app
          }
        };

        var latLng = AppGlobals.getUserLatLng();
        $log.log('latLng ', latLng);
        VenueService.getVenueAddressForInvite(AppGlobals.getVenueId())
            .then(function (str) {
              var address = 'Come join me, I\'m at : \n \n' + str + '\n \n';
              var loc = 'http://maps.google.com/?q=' + latLng.lat + ',' + latLng.lng;
              var tMsg = address + loc + '\n \n' + 'sent from the Social Order app.' ;
              $log.log('cordova send ', tMsg);

              $cordovaSms.send(c.phoneNumbers[0].value, tMsg, options).then(function () {
                $log.log('msg sent ');
              }, function (error) {
                $log.log('msg failed ', error);
                    /*
                     var msg = 'Your text message was not sent, please try again.'
                     $cordovaDialogs.confirm(msg, 'Error', ['OK'])
                     .then(function () {

                     });
                     */
              });

            }, function (err) {
              $log.log('error ', err);
            });

      }

      return {
        sendSmsInvite: inviteFriends
      };

    });
