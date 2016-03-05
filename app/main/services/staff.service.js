/*global Firebase */
'use strict';
angular.module('main')
    .factory('StaffService', function (KEYS, $q, $log) {
      var staffUri = KEYS.firebase + '/staff';
      var staffRef = new Firebase(staffUri);

      var addStaffChannelId = function (uid, key) {
        var deferred = $q.defer();
        staffRef.child(uid).child('channel_id').set(key, function (error) {
          if (error) {
            $log.log('StaffService - addStaffChannelId : error', error);
            deferred.reject();
          } else {
            $log.log('StaffService - addStaffChannelId : saved data');
            deferred.resolve();
          }
        });

        return deferred.promise;
      };

      var getVenueListById = function (uid) {
        $log.log('getVenueListById : uid -', uid);
        var deferred = $q.defer();
        var list = [];
        var venues = staffRef.child(uid).child('venues');
        venues.once('value', function (snapshot) {
          if (snapshot.val() !== null) {
            snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              list.push(childData);
              $log.log('child data ', childData );
            });
            deferred.resolve(list);
            list = null;
          } else {
            $log.log('No items found');
            deferred.reject();
          }
        });

        return deferred.promise;
      };

      return {
        addStaffChannelId: addStaffChannelId,
        getVenueListById: getVenueListById

      };
    });
