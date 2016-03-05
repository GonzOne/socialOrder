'use strict';
angular.module('main')
    .controller('StaffController', function ($scope, $state, $ionicLoading, $cordovaCamera, $cordovaImagePicker, staff, AppGlobals, LoginService, ImageService, $log) {
      var vm = this;
      //exports
      vm.edit = edit;
      vm.logIn = logIn;
      vm.captureImage = captureImage;
      vm.selectImage = selectImage;
      vm.startUpload = startUpload;
      vm.navigateTo = navigateTo;

      function navigateTo (str) {
        switch (str) {
          case 'dashboard':
            $state.go('dashboard', {uId: AppGlobals.getUserId()});
            break;
          default:
        }
      }
      //refactor:  to image service
      function captureImage () {
        var pictureSource = navigator.camera.PictureSourceType.CAMERA;
        var destinationType = navigator.camera.DestinationType.FILE_URI;
        var options = {
          quality: 80,
          targetWidth: 120,
          targetHeight: 120,
          pictureSource: pictureSource,
          destinationType: destinationType,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
          vm.imageSrc = imageData;
          vm.profilePicAdded = true;
        }, function (err) {
          $log.log('getPicture', err);
        });
      }
      function selectImage () {
        var options = {
          maximumImagesCount: 1,
          width: 120,
          height: 120,
          quality: 80
        };
        $cordovaImagePicker.getPictures(options)
              .then(function (results) {
                $log.log('getPictures', results[0]);
                vm.imageSrc = results[0];
                vm.profilePicAdded = true;
              }, function (error) {
                $log.log('getPictures', error);
              });
      }
      function startUpload () {
        uploadImage();
      }
      function uploadImage () {
        $log.log('uploadImage init');
        var filePath = vm.imageSrc;
        var folder = 'profileAssets';
        ImageService.uploadImage(filePath, folder).then(function (results) {
          $log.log('uploadImage returned', results);
          $log.log(' store ', results.url);
          vm.profilePic = results.url;
          vm.profilePicUploaded = true;
        }, function (error) {
          $log.log('uploadImage', error);
        });
      }
      function edit () {
        vm.editActive = !vm.editActive;
      }
      function logIn () {
        if (!AppGlobals.isLoggedIn()) {
          LoginService.displayLogIn().then( function (res) {
            switch (res) {
              case 'signin-success':
                AppGlobals.setLoggedIn(true);
                vm.isUserLoggedIn = AppGlobals.isLoggedIn();
                break;
              case 'signup':
                $state.go('signup');
                break;
              case 'password-reset':
                $state.go('password_reset');
                break;
            }
          });

        } else {
          LoginService.logOut();
          $ionicLoading.show({
            template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Logging Out..',
            duration: 2000
          });
          vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        }
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        vm.user = staff;
        vm.profilePic = ImageService.resizeImage(vm.user.profilePicUrl, {
          width: 600,
          height: 400,
          blur: true
        });
        vm.editActive = false;
      });

    });
