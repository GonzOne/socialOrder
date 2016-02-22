/*global Firebase */
'use strict';
angular.module('main')
    .factory('VenueService', function (KEYS, $q, $firebaseArray, $log) {
      var venueUri = KEYS.firebase + 'venues';
      var venueRef = new Firebase(venueUri);
      var venues = $firebaseArray(venueRef);

      var venueMenusUri = KEYS.firebase + 'venue_menus';
      var venueMenusRef = new Firebase(venueMenusUri);

      var venueOrderHistory = KEYS.firebase + 'venue_history';
      var venueOrderHistoryRef = new Firebase(venueOrderHistory);

      //var  menuItemCollection;

      var getVenuesByZip = function (zipcode) {
        var list = [];
        var deferred = $q.defer();
        var queryRef = venueRef.orderByChild('zipcode').equalTo(zipcode);
        queryRef.on('value', function (querySnapshot) {
          if (querySnapshot.val() !== null) {
            querySnapshot.forEach(function (childSnapshot) {
              if (childSnapshot.child('active').val() === 1) {
                list.push(childSnapshot.val());
              }
            });
            deferred.resolve(list);
          } else {
            deferred.reject();
          }
        });
        /*
        venueRef.orderByChild('zipcode').equalTo(zipcode).on('child_added', function (snapshot) {
          if (snapshot.child('active').val() === 1) {
            list.push(snapshot.val());
          }

          deferred.resolve(list);

        }, function (err) {
          $log.log('Error ', err);
          deferred.reject();
        });
        */
        return deferred.promise;
      };

      var getVenuesByLatLng = function getVenuesByLatLng (pos) {
        $log.log('getVenuesByLatLng ', pos);
      };

      var getMenuById = function (key) {
        $log.log('getMenuById : key -', key);
        var deferred = $q.defer();
        //var list = [];
        var venueMenu = venueMenusRef.child(key);
        venueMenu.once('value', function (snapshot) {

          if (snapshot.val() !== null) {
            deferred.resolve(snapshot.val());
          } else {
            $log.log('No items found');
            deferred.reject();
          }

        });

        return deferred.promise;
      };

      var getMenuItemsById = function (key, itemId) {
        $log.log('VenueService - getMenuItemsById : key ', key, ' itemId ', itemId);
        var deferred = $q.defer();
        //var list = [];
        var venueMenuItems = venueMenusRef.child(key).child('menu').child(itemId);
        venueMenuItems.once('value', function (snapshot) {
          if (snapshot.val() !== null) {
            deferred.resolve(snapshot.val());
          } else {
            deferred.reject();
          }

        });
        return deferred.promise;
      };
      var getVenueFooterDetail = function (key) {
        $log.log('getVenueById : key ', key);
        var deferred = $q.defer();
        var venue = venueRef.child(key);
        venue.once('value', function (snapshot) {
          var data = snapshot.val();
          var footerObj = {
            name: data.name,
            photo: data.photo_url
          };

          deferred.resolve(footerObj);

        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      };

      var getVenueAddressForInvite = function (key) {
        $log.log('getVenueAddressById : key ', key);
        var deferred = $q.defer();
        var venue = venueRef.child(key);
        venue.once('value', function (snapshot) {
          var data = snapshot.val();
          var str = data.name + '\n' +
                data.address + '\n' +
                data.city + ' ' + data.state + ' ' + ',' + data.zipcode;
          deferred.resolve(str);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      };

      var getVenueStaffListById = function (key) {
        $log.log('getVenueStaffListById : key -', key);
        var deferred = $q.defer();
        var list = [];
        var venueStaff = venueRef.child(key).child('staff');
        venueStaff.once('value', function (snapshot) {
          if (snapshot.val() !== null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              list.push(childData);
              $log.log('key', key, 'child data ', childData );
            });

            deferred.resolve(list);

          } else {
            $log.log('No items found');
            deferred.reject();
          }

        });

        return deferred.promise;
      };

      var getVenueById = function (key) {
        $log.log('getVenueById : key ', key);
        var deferred = $q.defer();
        var venue = venueRef.child(key);
        venue.once('value', function (snapshot) {
          var data = snapshot.val();
          deferred.resolve(data);

        }, function (err) {

          deferred.reject(err);

        });

        return deferred.promise;
      };

      var getVenueChannelId = function (key) {
        $log.log('getVenueChannelId : vid ', key);
        var deferred = $q.defer();
        var venue = venueRef.child(key);
        venue.once('value', function (snapshot) {
          var data = snapshot.val();
          deferred.resolve(data.channel_id);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      };

      var setVenueChannelId = function (vId, cId) {
        $log.log('venueService - setVenueChannelId - key : ', vId, 'channel id ', cId);
        var deferred = $q.defer();
        var vRef = venueRef.child(vId);
        vRef.update({'channel_id': cId}, function (error) {
          if (error) {
            $log.log('VenueService setVenueChannelId : error ', error);
            deferred.reject(error);
          } else {
            $log.log('VenueService setVenueChannelId : saved data');
            deferred.resolve();
          }
        });

        return deferred.promise;
      };

      var archiveVenueOrder = function (data) {
        var archive = $firebaseArray(venueOrderHistoryRef.child(data.vid));
        archive.$add(data);
      };

      var getVenueName = function (key) {
        var deferred = $q.defer();
        var venueName = venueRef.child(key).child('name');
        venueName.once('value', function (snapshot) {
          deferred.resolve(snapshot.val());
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      };

      return {
        getVenueName: getVenueName,
        getVenuesByZip: getVenuesByZip,
        getVenueById: getVenueById,
        getVenuesByLatLng: getVenuesByLatLng,
        getAllVenues: function () { return venues; },
        getMenuById: getMenuById,
        getMenuItemsById: getMenuItemsById,
        getVenueFooterDetail: getVenueFooterDetail,
        getVenueStaffListById: getVenueStaffListById,
        setVenueChannelId: setVenueChannelId,
        getVenueChannelId: getVenueChannelId,
        getVenueAddressForInvite: getVenueAddressForInvite,
        //setMenuItemCollection: function (val) {menuItemCollection = val;},
        //getMenuItemCollection: function () { return menuItemCollection; },
        archiveVenueOrder: archiveVenueOrder


      };
    });
