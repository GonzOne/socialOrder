'use strict';
angular.module('main')
    .factory('CartService', function ($log) {
      var currentOrder = [];
      var pendingOrder = null;
      var acceptedOrder = null;
      /*
      var addToOrder = function (inArry) {
        $log.log('CartService - addToCartService ', inArry);
        var len = inArry.length;
        for (var i = 0; i < len; i++) {
          currentOrder.push(inArry[i]);
        }
        $log.log('CartService - currentOrder ', currentOrder);
      };
      */
      var addToOrder = function (obj) {
        currentOrder.push(obj);
      };

      var isOrderEmpty = function () {
        var bool = false;
        var len = currentOrder.length;
        if ( len <= 0) {
          bool = true;
        }
        return bool;
      };

      var getOrderTotal = function (inArray) {
        $log.log('getOrderTotal ', inArray);
        var a = [];
        var len = inArray.length;
        for (var i = 0; i < len; i++) {
          var number = inArray[i].cost;
          var nodecimals = number | 0;
          a.push(nodecimals);
        }
        return a.reduce(function (a, b) { return a + b; }, 0);
      };

      return {
        addToOrder: addToOrder,
        getUserOrder: function () {return currentOrder;},
        isOrderEmpty: isOrderEmpty,
        clearOrder: function () { currentOrder = [];},
        //
        setPendingOrder: function (val) { pendingOrder = val;},
        getPendingOrder: function () { return pendingOrder;},
        clearPendingOrder: function () {pendingOrder = null;},
        //
        setAcceptedOrder: function (val) { acceptedOrder = val;},
        getAcceptedOrder: function () { return acceptedOrder;},
        clearAcceptedOrder: function () {acceptedOrder = null;},
        getOrderTotal: getOrderTotal
      };
    });
