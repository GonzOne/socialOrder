'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'angular-loading-bar',
  'ngFileUpload',
  'angular-momentjs',
  'ngAnimate',
  'LocalStorageModule',
  'ngMap',
  'ngMessages'
])
.constant('KEYS', {
  firebase: 'https://socialorder.firebaseio.com/',
  cloudinary: {
    cloudName: 'stheory',
    preset: 'k0di9s1v',
    apiBase: 'https://api.cloudinary.com/v1_1/'
  }
})

.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('so_client');
}])

.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
})

.run(function ($ionicPlatform, AppGlobals, $log) {


  $ionicPlatform.ready(function () {
    $log.log('$ionicPlatform is ready ');

    if (window.cordova) {
      AppGlobals.setWebView(true);
    }
    if ( window.cordova && window.cordova.plugins.NativeAudio ) {
      window.plugins.NativeAudio.preloadSimple('notification', '/main/assets/audio/notification.wav', function (msg) {
        $log.log('$cordovaNativeAudio.preloadSimple : notification ', msg);
      }, function (error) {
        $log.log('$cordovaNativeAudio.preloadSimple : notification ', error);
      });
      window.plugins.NativeAudio.preloadSimple('accept', '/main/assets/audio/accept.wav', function (msg) {
        $log.log('$cordovaNativeAudio.preloadSimple : accept ', msg);
      }, function (error) {
        $log.log('$cordovaNativeAudio.preloadSimple : accept ', error);
      });
    }

  });

})

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'main/templates/venue/venues.view.html',
      controller: 'VenuesController as venuesController'
    })
    .state('map', {
      cache: false,
      url: '/map/:zipcode',
      templateUrl: 'main/templates/map/map.view.html',
      controller: 'MapController as mapController',
      resolve: {
        venues: ['$stateParams', 'VenueService',
                  function ($stateParams, VenueService) {
                    return VenueService.getVenuesByZip($stateParams.zipcode);
                  }
              ]
      }
    })
    .state('menu', {
      url: '/menu/:menuId',
      templateUrl: 'main/templates/menu/venue-menu.view.html',
      controller: 'VenueMenuController as venueMenuController',
      resolve: {
        menu: ['$stateParams', 'VenueService',
                  function ($stateParams, VenueService) {
                    return VenueService.getMenuById($stateParams.menuId);
                  }
              ]
      }
    })
    .state('category', {
      url: '/menu/category/:menuId?itemId',
      templateUrl: 'main/templates/menu/venue-menu-item.view.html',
      controller: 'VenueMenuItemController as venueMenuItemController',
      resolve: {
        items: ['$stateParams', 'VenueService',
                  function ($stateParams, VenueService) {
                    return VenueService.getMenuItemsById($stateParams.menuId, $stateParams.itemId);
                  }
              ]
      }
    })
    .state('dashboard', {
      url: '/dashboard/:uId',
      templateUrl: 'main/templates/dashboard/dashboard.view.html',
      controller: 'DashboardController as dashboardController',
      resolve: {
        staff: ['$stateParams', 'ProfileService',
                  function ($stateParams, ProfileService) {
                    return ProfileService.getStaffProfileById($stateParams.uId);
                  }
              ]
      }
    })
    .state('orders', {
      url: '/orders/:channelId',
      templateUrl: 'main/templates/orders/orders.view.html',
      controller: 'OrdersController as ordersController',
      resolve: {
        orders: ['$stateParams', 'MessageService',
                  function ($stateParams, MessageService) {
                    return MessageService.forVenueMessages($stateParams.channelId).$loaded();
                  }
              ]
      }
    })
    .state('order-details', {
      url: '/order/details/:orderId?channelId',
      templateUrl: 'main/templates/orders/orders.detail.view.html',
      controller: 'OrderDetailController as orderDetailController',
      resolve: {
        userOrder: ['$stateParams', 'MessageService',
                  function ($stateParams, MessageService) {
                    return MessageService.getMessageById($stateParams.channelId, $stateParams.orderId);
                  }
              ]
      }
    })
    .state('profile', {
      url: '/profile/:uId',
      templateUrl: 'main/templates/profile/profile.view.html',
      controller: 'ProfileController as profileController',
      resolve: {
        profile: ['$stateParams', 'ProfileService',
                  function ($stateParams, ProfileService) {
                    return ProfileService.getPatronProfileById($stateParams.uId);
                  }
               ]
      }
    })
    .state('staff', {
      url: '/staff/:uId',
      templateUrl: 'main/templates/staff/staff.view.html',
      controller: 'StaffController as staffController',
      resolve: {
        staff: ['$stateParams', 'ProfileService',
                function ($stateParams, ProfileService) {
                  return ProfileService.getStaffProfileById($stateParams.uId);
                }
              ]
      }
    })
    .state('staff-menu', {
      url: '/staff-menu/:menuId',
      templateUrl: 'main/templates/menu/venue-menu-list.view.html',
      controller: 'VenueStaffMenuController as venueStaffMenuController',
      resolve: {
        menu: ['$stateParams', 'VenueService',
                  function ($stateParams, VenueService) {
                    return VenueService.getMenuById($stateParams.menuId);
                  }
              ]
      }
    });

  $urlRouterProvider.otherwise('/main');

});
