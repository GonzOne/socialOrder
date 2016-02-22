'use strict';
angular.module('main')
    .factory('AppGlobals', function () {
      var isWebView = null;
      var uid = null;
      var uName = null;
      var uAvatar = null;
      var venueId = null;
      var menuId = null;
      var isLoggedIn = false;
      var userRole = null;
      var userZipcode = null;
      var latLng = null;
      var venueFooterData = null;
      var venueChannelId = null;
      var directChannelId = null;
      var channel = null;
      var orderId = null;
      var orderStatus = null;
      var staffName = null;
      var staffAvatar = null;

      return {
        isWebView: function () { return isWebView;},
        setWebView: function (val) { isWebView = val;},
        setUserId: function (val) { uid = val;},
        getUserId: function () {return uid;},
        setUserAvatar: function (val) { uAvatar = val;},
        getUserAvatar: function () { return uAvatar;},
        setUserName: function (val) {uName = val;},
        getUserName: function () { return uName;},
        setVenueId: function (val) { venueId = val;},
        getVenueId: function () { return venueId;},
        setMenuId: function (val) { menuId = val;},
        getMenuId: function () { return menuId;},
        isLoggedIn: function () { return isLoggedIn;},
        setLoggedIn: function (bool) { isLoggedIn = bool;},
        setUserRole: function (val) { userRole = val;},
        getUserRole: function () {return userRole;},
        setUserLatLng: function (inObj) { latLng = inObj;},
        getUserLatLng: function () {return latLng;},
        setUserZipcode: function (val) { userZipcode = val; },
        getUserZipcode: function () {return userZipcode;},
        setVenueFooterData: function (inObj) {venueFooterData = inObj;},
        getVenueFooterData: function () { return venueFooterData;},
        setChannelId: function (val) { channel = val;},
        getChannelId: function () { return channel;},
        setVenueChannelId: function (val) { venueChannelId = val;},
        getVenueChannelId: function () { return venueChannelId;},
        setOrderId: function (val) { orderId = val;},
        getOrderId: function () { return orderId;},
        setDirectChannelId: function (val) { directChannelId = val;},
        getDirectChannelId: function () { return directChannelId;},
        clearDirectChannelId: function () {directChannelId = null;},
        setOrderStatus: function (val) { orderStatus = val;},
        getOrderStatus: function () { return orderStatus;},
        setStaffName: function (val) { staffName = val;},
        getStaffName: function () { return  staffName;},
        setStaffAvatar: function (val) { staffAvatar = val;},
        getStaffAvatar: function () { return staffAvatar;},
        logOut: function () {
          uid = null;
          uName = null;
          uAvatar = null;
          venueId = null;
          menuId = null;
          isLoggedIn = false;
          userRole = null;
          latLng = null;
          venueFooterData = null;
          userZipcode = null;
          venueChannelId = null;
          orderId = null;
          orderStatus = null;
          directChannelId = null;
          staffName = null;
          staffAvatar = null;
        },
      };
    });
