'use strict';
angular.module('main')
    .controller('ProfileController', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, $cordovaCamera, $cordovaImagePicker, profile, AppGlobals, LoginService, ImageService, ProfileService, $log) {
      var vm = this;
      //exports
      vm.edit = edit;
      vm.logIn = logIn;
      vm.goBack = goBack;
      vm.captureImage = captureImage;
      vm.selectImage = selectImage;
      vm.updateProfile = updateProfile;

      function updateProfile () {
        ProfileService.updateProfileById(vm.user.uid, vm.user).then(function () {
          $log.log('updateProfileById saved ');
          vm.editActive = false;
          $ionicPopup.alert({
            title: 'PROFILE UPDATED',
            template: 'Your changes have been applied.'
          });
        }, function (error) {
          $ionicPopup.alert({
            title: 'UPDATE PROFILE ERROR',
            template: error
          });
        });
      }
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
          uploadImage();
        }, function (err) {
          $log.log('getPicture', err);
        });
        uploadImage();
      }
      //refactor - move into image service
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
                uploadImage();
              }, function (error) {
                $log.log('getPictures', error);
              });
        uploadImage();
      }
      //refactor - add to imageService
      function uploadImage () {
        $log.log('uploadImage init');
        if (typeof vm.imageSrc === 'undefined') {
          return;
        }
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
      function goBack () {
        $ionicHistory.goBack();
      }
      function edit () {
        vm.editActive = !vm.editActive;
      }
      function logIn () {
        if (!AppGlobals.isLoggedIn()) {
          LoginService.displayLogIn().then( function (res) {
            switch (res) {
              case 'signin-success':
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
          $state.go('main');
        }
      }
      $scope.$on('$ionicView.enter', function () {
        vm.isUserLoggedIn = AppGlobals.isLoggedIn();
        vm.user = profile;
        vm.profilePic = ImageService.resizeImage(vm.user.profilePicUrl, {
          width: 600,
          height: 400,
          blur: true
        });
        vm.editActive = false;
      });

    });
