/*global Firebase */
'use strict';
angular.module('main')
    .factory('ProfileService', function ($q, $firebaseArray, $firebaseObject, $firebaseUtils, $firebase, KEYS, $log) {
      var profileUri = KEYS.firebase + '/meta-profiles';
      var profileRef = new Firebase(profileUri);
      //
      var patronsUri = KEYS.firebase + '/patrons';
      var patronsRef = new Firebase(patronsUri);

      var patronsArchive = KEYS.firebase + '/patrons_history';
      var patronsArchiveRef = new Firebase(patronsArchive);
      //
      var staffUri = KEYS.firebase + '/staff';
      var staffRef = new Firebase(staffUri);

        //Meta
      var createMetaProfile = function (pData) {
        var deferred = $q.defer();
        $log.log('createMetaProfile for ', pData.uid, ' profile data ', pData);
        pData.role = parseInt(pData.role);//convert string to number
        pData.profileCreated = Firebase.ServerValue.TIMESTAMP;
        profileRef.child(pData.uid).set(pData, function (error) {
          if (error) {
            $log.log('profileService - createMetaProfile : error', error);
            deferred.reject();
          } else {
            $log.log('profileService - createMetaProfile : saved data');
            deferred.resolve(pData.uid);
          }
        });

        return deferred.promise;
      };

      var getMetaProfileById = function (uid) {
        var deferred = $q.defer();
        var metaProfile = profileRef.child(uid);
        metaProfile.once('value', function (snapshot) {
          $log.log('getMetaProfileById : snapshot ', snapshot );
          var data = snapshot.val();
          $log.log('getMetaProfileById : data ', data );
          deferred.resolve(data);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      };

      //Patrons
      var createPatronProfile = function (pData) {
        var deferred = $q.defer();
        $log.log('createPatronProfile for ', pData.uid, ' profile data ', pData);
        pData.profileCreated = Firebase.ServerValue.TIMESTAMP;
        patronsRef.child(pData.uid).set(pData, function (error) {
          if (error) {
            $log.log('profileService - createPatronProfile : error', error);
            deferred.reject();
          } else {
            $log.log('profileService - createPatronProfile : saved data');
            deferred.resolve(pData.uid);
          }
        });

        return deferred.promise;
      };

      var getPatronProfileById = function (uid) {
        var deferred = $q.defer();
        var profile = patronsRef.child(uid);
        profile.once('value', function (snapshot) {
          $log.log('getPatronProfileById : snapshot ', snapshot );
          var data = snapshot.val();
          $log.log('getPatronProfileById : data ', data );
          deferred.resolve(data);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      };

      var getStaffProfileById = function (uid) {
        var deferred = $q.defer();
        var staffProfile = staffRef.child(uid);
        staffProfile.once('value', function (snapshot) {
          $log.log('getStaffProfileById : snapshot ', snapshot );
          var data = snapshot.val();
          $log.log('getStaffProfileById : data ', data );
          deferred.resolve(data);
        }, function (err) {
          deferred.reject(err);
        });

        return deferred.promise;
      };

      var archivePatronsOrder = function (data) {
        var archive = $firebaseArray(patronsArchiveRef.child(data.uid));
        archive.$add(data);
      };

      var addPatronProfilePic = function (uid, url) {
        var deferred = $q.defer();
        patronsRef.child(uid).child('profilePicUrl').set(url, function (error) {
          if (error) {
            $log.log('addPatronProfilePic : error', error);
            deferred.reject();
          } else {
            $log.log('addPatronProfilePic : saved data');
            deferred.resolve();
          }
        });

        return deferred.promise;
      };

      var updateProfileById = function (uid, obj) {
        var deferred = $q.defer();
        patronsRef.child(uid).set(obj, function (error) {
          if (error) {
            $log.log('updateProfileById : error', error);
            deferred.reject();
          } else {
            $log.log('updateProfileById : saved data');
            deferred.resolve();
          }
        });

        return deferred.promise;

      };

      var updateStaffProfileById = function (uid, obj) {
        var deferred = $q.defer();
        staffRef.child(uid).set(obj, function (error) {
          if (error) {
            $log.log('updateStaffProfileById : error', error);
            deferred.reject();
          } else {
            $log.log('updateStaffProfileById : saved data');
            deferred.resolve();
          }
        });

        return deferred.promise;

      };

      return {
        createMetaProfile: createMetaProfile,
        getMetaProfileById: getMetaProfileById,
        createPatronProfile: createPatronProfile,
        getPatronProfileById: getPatronProfileById,
        updateProfileById: updateProfileById,
        getStaffProfileById: getStaffProfileById,
        updateStaffProfileById: updateStaffProfileById,
        archivePatronsOrder: archivePatronsOrder,
        addPatronProfilePic: addPatronProfilePic
      };

    });
