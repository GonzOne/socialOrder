'use strict';
angular.module('main')
    .factory('ImageService', function ($q, $ionicLoading, $cordovaFileTransfer, KEYS, $log) {
      var uploadImage = function (imageURI, folder) {
        $log.log('uploadImage ', imageURI);
        var deferred = $q.defer();
        var fileSize;
        var percentage;
          // Find out how big the original file is
        window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {
          fileEntry.file(function (fileObj) {
            fileSize = fileObj.size;
            // Display a loading indicator reporting the start of the upload
            $ionicLoading.show({template: 'Uploading Picture : ' + 0 + '%'});
              // Trigger the upload
            uploadFile();
          });
        });
        function uploadFile () {
              // Add the Cloudinary "upload preset" name to the headers
          var uploadOptions = {
            params: { upload_preset: KEYS.cloudinary.preset,
                      folder: folder,
                      tags: 'mobile_upload'
                    }
          };

          var url = KEYS.cloudinary.apiBase + KEYS.cloudinary.cloudName + '/upload';
          $cordovaFileTransfer
                  .upload(url, imageURI, uploadOptions)

                  .then(function (result) {
                    $ionicLoading.show({template: 'Upload Completed', duration: 1000});
                    var response = JSON.parse(decodeURIComponent(result.response));
                    deferred.resolve(response);
                  }, function (err) {
                    $ionicLoading.show({template: 'Upload Failed', duration: 3000});
                    deferred.reject(err);
                  }, function (progress) {
                    percentage = Math.floor(progress.loaded / fileSize * 100);
                    $ionicLoading.show({template: 'Uploading Picture : ' + percentage + '%'});
                  });
        }

        return deferred.promise;
      };

      return {
        uploadImage: uploadImage
      };

    });
