'use strict';
angular.module('main')
    .controller('RegisterController', function ($scope, $state, $ionicHistory, $ionicLoading, $ionicPopup, $cordovaCamera, ImageService, $cordovaImagePicker,  Auth, localStorageService, AppModalService, AppGlobals, ProfileService, $log) {
      var vm = this;
      vm.userCreated = false;
      vm.months = [
            {id: 1, name: 'January'},
            {id: 2, name: 'February'},
            {id: 3, name: 'March'},
            {id: 4, name: 'April'},
            {id: 5, name: 'May'},
            {id: 6, name: 'June'},
            {id: 7, name: 'July'},
            {id: 8, name: 'August'},
            {id: 9, name: 'September'},
            {id: 10, name: 'October'},
            {id: 11, name: 'November'},
            {id: 12, name: 'December'}
      ];
      vm.terms = false;
      vm.user = {
        email: '',
        password: ''
      };
      vm.confirmedPassword;
      vm.month;
      vm.year;
      vm.userProfile = {
        uid: '',
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        sex: '',
        profilePicUrl: '',
        terms: false,
        venues: ''

      };
      //exports
      vm.displayTerms = displayTerms;
      vm.createAcount = createAcount;
      vm.captureImage = captureImage;
      vm.selectImage = selectImage;
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
          vm.userProfile.profilePicUrl = results.url;
          vm.profilePicUploaded = true;
        }, function (error) {
          $log.log('uploadImage', error);
        });
      }
      function displayTerms () {
        var templateUrl = './main/templates/terms/terms.modal.view.html';
        AppModalService.show(templateUrl, 'TermsCtrl as termsCtrl')
                .then(function (result) {
                  vm.userProfile.terms = result;
                  vm.terms = result;
                }, function (err) {
                  $log.log('modal error ', err);
                });
      }
      function createPatronProfile (uid) {
        $log.log('createPatronProfile ', vm.userProfile);
        vm.userProfile.uid = uid;
        ProfileService.createPatronProfile(vm.userProfile).then(function (uid) {
          $log.log('patron profile created', uid);
          vm.userCreated = true;
          ProfileService.getMetaProfileById(AppGlobals.getUserId())
              .then(function (data) {
                AppGlobals.setUserRole = data.role;
                AppGlobals.setLoggedIn(true);
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: 'Success',
                  template: 'Thanks for joining!'
                });
              }, function (error) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: 'RETRIVE META ERROR',
                  template: error
                });
              });
        }, function (error) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'PROFILE CREATION ERROR',
            template: error
          });
        });

      }

      function createMetaProfile (uid) {
        var metaProfile = {
          uid: '',
          role: ''
        };
        metaProfile.uid = uid;
        metaProfile.role = 1;
        $log.log('sign up controller ', metaProfile);
        ProfileService.createMetaProfile(metaProfile).then(function (uid) {
          $log.log('meta profile created', uid);
          AppGlobals.setUserRole = metaProfile.role;
          createPatronProfile(uid);
        }, function (error) {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'META CREATION ERROR',
            template: error
          });
        });
      }
      function login () {
        vm.userProfile.email = vm.user.email;
        Auth.$authWithPassword(vm.user).then(function (authData) {
          $log.log('login success - auth ', authData);
          vm.userProfile.uid = authData.uid;
          localStorageService.set('token', authData.token);
          createMetaProfile(authData.uid);
        }, function (error) {
          var errorMsg;
          $log.log('error.code ', error.code);
          switch (error.code) {
            case 'INVALID_EMAIL':
              errorMsg = 'The specified user account email is invalid.';
              break;
            case 'INVALID_PASSWORD':
              errorMsg = 'The specified user account password is incorrect.';
              break;
            case 'INVALID_USER':
              errorMsg = 'The specified user account does not exist.';
              break;
            default:
              errorMsg = 'Invalid email address';
          }
          $ionicPopup.alert({
            title: 'SIGN IN ERROR',
            template: errorMsg
          });
        });
      }

      function register () {

        Auth.$createUser(vm.user).then(function (authData) {
          $log.log('register user returned : ', authData);
          AppGlobals.setUserId(authData.uid);
          AppGlobals.isLoggedIn(true);
          login();
        }, function (error) {
          var errorMsg;
          $log.log('error.code ', error.code);
          switch (error.code) {
            case 'EMAIL_TAKEN':
              errorMsg = 'The new user account cannot be created because the email is already in use.';
              break;
            case 'INVALID_EMAIL':
              errorMsg = 'The specified email is not a valid email.';
              break;
            default:
              errorMsg = 'Error creating user: ' + error;
          }
          $ionicPopup.alert({
            title: 'SIGN IN ERROR',
            template: errorMsg
          });
        });
      }
      function createAcount () {
        $log.log('confirm ', vm.confirmedPassword, ' user ', vm.user.password);
        if (vm.user.password !== vm.confirmedPassword) {
          $ionicPopup.alert({
            title: 'Password Error',
            template: 'Passwords do not match, please re-enter.'
          });
          return;
        }
        if (vm.userProfile.profilePicUrl.length === 0) {
          $ionicPopup.alert({
            title: 'Profile Image',
            template: 'Please add a profile image, we need to be able to identify you.'
          });
          return;
        }
        $log.log('vm.userProfile.profilePicUrl  ', vm.userProfile.profilePicUrl );
        vm.userProfile.dateOfBirth = vm.month + '/' + vm.year;
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-light" icon="spiral"></ion-spinner><br>Saving your profile...'
        });
        register();
      }
      function createYearOptions () {
        vm.years = [];
        var d = new Date();
        for (var i = (d.getFullYear() - 21); i > (d.getFullYear() - 100); i--) {
          vm.years .push(i);
        }
      }
      //exports

      $scope.$on('$ionicView.enter', function () {
        createYearOptions();
      });
      $scope.$on('$ionicView.leave', function () {
      });
    });
