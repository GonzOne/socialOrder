/*global Firebase */
'use strict';
angular.module('main')
    .factory('MessageService', function ($q, $firebaseArray, $firebaseObject, KEYS, DateFormatter, $log) {
      var venueChannelMessagesRef = new Firebase(KEYS.firebase + 'venueOrders');
      var channelMessagesRef = new Firebase(KEYS.firebase + 'channelMessages');
      var userMessagesRef = new Firebase(KEYS.firebase + 'directMessages');


      var createChannel = function (uid) {
        var deferred = $q.defer();
        $log.log('createChannel');
        var newChildRef = channelMessagesRef.push();
        var time = Firebase.ServerValue.TIMESTAMP;
        var data = {owner: uid, key: newChildRef.key(), users: '', loggedIn: time};
        newChildRef.set(data, function (error) {
          if (error) {
            $log.log(' createChannel : error', error);
            deferred.reject();
          } else {
            var k = newChildRef.key();
            $log.log(' createChannel : saved data', k);
            deferred.resolve(k);
          }
        });
        return deferred.promise;
      };

      var createVenueChannel = function () {
        var deferred = $q.defer();
        $log.log('createVenueChannel');
        var newChildRef = venueChannelMessagesRef.push();
        var time = Firebase.ServerValue.TIMESTAMP;
        var data = {key: newChildRef.key(), messages: '', loggedIn: time};
        newChildRef.set(data, function (error) {
          if (error) {
            $log.log(' createChannel : error', error);
            deferred.reject();
          } else {
            var k = newChildRef.key();
            $log.log(' createChannel : saved data', k);
            deferred.resolve(k);
          }
        });
        return deferred.promise;
      };

      var createDirectChannel = function (data) {
        var deferred = $q.defer();
        $log.log('createDirectChannel');
        var newChildRef = userMessagesRef.push();
        var time = Firebase.ServerValue.TIMESTAMP;
        data.key = newChildRef.key();
        data.loggedIn = time;
        newChildRef.set(data, function (error) {
          if (error) {
            $log.log(' createChannel : error', error);
            deferred.reject();
          } else {
            var k = newChildRef.key();
            $log.log(' createChannel : saved data', k);
            deferred.resolve(k);
          }
        });
        return deferred.promise;
      };

      var sendMessage = function (channelId, inOrder) {
        $log.log('sendMessage channel id ', channelId, 'order ', inOrder );
        var messages = $firebaseArray(venueChannelMessagesRef.child(channelId));
        inOrder.timestamp = Firebase.ServerValue.TIMESTAMP;
        var currentTime =  DateFormatter.formatAMPM();//shoul use momento and create a filter
        $log.log('formattedTime ', currentTime);
        inOrder.orderTime = currentTime;
        messages.$add(inOrder);
      };

      var getMessageById = function (channelId, k) {
        var deferred = $q.defer();
        var item = venueChannelMessagesRef.child(channelId).child(k);
        item.once('value', function (snapshot) {
          $log.log('getMessageById : snapshot ', snapshot );
          var data = snapshot.val();
          $log.log('getMessageById : data ', data );
          deferred.resolve(data);
        }, function (err) {
          deferred.reject(err);
        });
        return deferred.promise;
      };

      var removeMessageById = function (channelId, k) {
        $log.log('removeMessageById : channelId - ', channelId, 'key ', k );
        var messages = venueChannelMessagesRef.child(channelId).child(k);
        messages.remove();
      };

      var getDirectMessageById = function (k) {
        $log.log('getDirectMessageById : k ', k);
        var dRef = userMessagesRef.child(k);
        return $firebaseObject(dRef);
      };

      var removeDirectMessageById = function (k) {
        $log.log('MessageService -  removeDirectMessageById : key ', k);
        var dm = userMessagesRef.child(k);
        dm.remove();
      };

      var setDirectMessageStaffById = function (staffData, k) {
        $log.log('setDirectMessageStaffById ', staffData, 'key ', k);
        var deferred = $q.defer();
        var dRef = userMessagesRef.child(k);
        dRef.update(staffData, function (error) {
          if (error) {
            $log.log(' setDirectMessageStaffById : error', error);
            deferred.reject();
          } else {
            $log.log(' setDirectMessageStaffById : saved data');
            deferred.resolve();
          }
        });
        return deferred.promise;
      };

      var sendDirectMessageById = function (dmId, msg) {
        $log.log('sendDirectMessageById ', dmId, ' msg ', msg );
        var messages = $firebaseArray(userMessagesRef.child(dmId).child('messages'));
        var currentTime =  DateFormatter.formatAMPM();
        $log.log('formattedTime ', currentTime);
        msg.timestamp = currentTime;
        messages.$add(msg);
      };

      return {
        createChannel: createChannel,
        createDirectChannel: createDirectChannel,
        sendMessage: sendMessage,
        getMessageById: getMessageById,
        removeMessageById: removeMessageById,
        getDirectMessageById: getDirectMessageById,
        removeDirectMessageById: removeDirectMessageById,
        setDirectMessageStaffById: setDirectMessageStaffById,
        sendDirectMessageById: sendDirectMessageById,
        forChannel: function (channelId) {
          return $firebaseArray(channelMessagesRef.child(channelId));
        },
        createVenueChannel: createVenueChannel,
        forVenueMessages: function (channelId) {
          return $firebaseArray(venueChannelMessagesRef.child(channelId));
        },
        forUsers: function (channelId) {
          return $firebaseArray(userMessagesRef.child(channelId));
        },
        forDirectMessage: function (dmId) {
          return $firebaseArray(userMessagesRef.child(dmId).child('messages'));
        },
        direct: function (uid1, uid2) {
          var path = uid1 < uid2 ? uid1 + '/' + uid2 : uid2 + '/' + uid1;
          return $firebaseArray(userMessagesRef.child(path));
        }

      };
    });
