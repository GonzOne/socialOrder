'use strict';
angular.module('main')
    .controller('VenueMenuItemController', function ($scope, $state, $timeout, items, $ionicLoading, $ionicHistory, $cordovaNativeAudio, $cordovaDialogs, AppModalService, CartService, $log) {
      var vm = this;
      vm.typeLabel;
      vm.items;
      vm.isWebView = ionic.Platform.isWebView();
      //exports
      vm.reviewOrder = reviewOrder;
      vm.addItem = addItem;
      vm.back = back;

      if (vm.isWebView) {

        $cordovaNativeAudio.preloadSimple('addItemPing', '/main/assets/audio/click.wav')
                .then(function (msg) {
                  $log.log('$cordovaNativeAudio.preloadSimple ', msg);
                }, function (error) {
                  $log.log('$cordovaNativeAudio.preloadSimple ', error);
                });
      }
      function back () {
        $ionicHistory.goBack();
      }
      function reviewOrder () {
        var orders = CartService.getUserOrder();
        if (orders.length > 0) {
          var templateUrl = './main/templates/checkout/checkout.modal.view.html';
          AppModalService.show(templateUrl, 'CheckoutController as checkoutController', orders)
                .then(function () {
                }, function (err) {
                  $log.log('modal error ', err);
                });
        } else {
          var msg = 'Oops, you haven\'t added anything to your tab, please select an item!';
          $cordovaDialogs.confirm(msg, 'Warning', ['OK'])
                .then(function () {
                    // no button = 0, 'OK' = 1, 'Cancel' = 2
                });
        }
      }
      function addItem (index) {
        if (vm.isWebView) {
          $cordovaNativeAudio.play('addItemPing');
        }
        var obj = vm.items[index];
        CartService.addToOrder(obj);

        displayAddOrderConifrmation();
      }
      function displayAddOrderConifrmation () {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Adding to Order...'
        });
        $timeout(function () {
          $ionicLoading.hide();
        }, 1500);
      }
      function displayArray (menuObj) {
        var menuArray = [];
        Object.keys(menuObj).forEach(function (key) {
          if (typeof(menuObj[key]) === 'object' ) {
            menuArray.push(menuObj[key]);
          }
        });
        return menuArray;
      }
      $scope.$on('$ionicView.enter', function () {
        vm.typeLabel =  items.displayName;
        vm.items =  displayArray(items.items);
      });
      $scope.$on('$ionicView.afterLeave', function () {
        vm.items =  null;
        vm.typeLabel = null;
      });
    });
