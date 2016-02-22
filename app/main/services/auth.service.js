/*global Firebase */
'use strict';
angular.module('main')
.factory('Auth', function ($firebaseAuth, KEYS) {
  var usersRef = new Firebase(KEYS.firebase);
  return $firebaseAuth(usersRef);
});
