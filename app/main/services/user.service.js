'use strict';
angular.module('main')
    .factory('UserData', function ($log) {
      var pendingOrder = null;
      var acceptedOrder = null;
      var currentOrder = [];
      var croppedImage;
      var currentMenuItem;
      var addToOrder = function (inArry) {
        $log.log('UserData - addToUserOrder ', inArry);

        var len = inArry.length;
        for (var i = 0; i < len; i++) {
          currentOrder.push(inArry[i]);
        }
        $log.log('UserData - currentOrder ', currentOrder);
      };

      var checkOrderArray = function () {
        var bool = false;
        var len = currentOrder.length;
        if ( len <= 0) {
          bool = true;
        }

        return bool;
      };

      var setCurrentItem = function (inArray) {
        currentMenuItem = inArray;
      };

      return {
        addToOrder: addToOrder,
        getUserOrder: function () {
          return currentOrder;
        },
        clearCurrentOrder: function () {
          currentOrder = [];
        },
        clearPendingOrder: function () {
          pendingOrder = null;
        },
        isOrderEmpty: checkOrderArray,
        getOrderLength: function () {
          return currentOrder.length;
        },
        //setPendingOrder: addPendingOrder,
        setPendingOrder: function (val) { pendingOrder = val;},
        getPendingOrder: function () {
          return  pendingOrder;
        },
        setAcceptedOrder: function (val) {
          acceptedOrder = val;
        },
        getAcceptedOrder: function () {
          return  acceptedOrder;
        },
        setUserCroppedImage: function (dataUrl) {
          croppedImage = dataUrl;
        },
        getUserCroppedImage: function () {
          return croppedImage;
        },
        setCurrentItem: setCurrentItem,
        getCurrentItem: function () { return currentMenuItem; }

      };
    });
