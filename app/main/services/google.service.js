/*global google */
'use strict';
angular.module('main')
    .factory('GoogleService', function ($q, $log) {
      var geocoder = new google.maps.Geocoder();
      var infoWindow = new google.maps.InfoWindow();
      var distMatrix = new google.maps.DistanceMatrixService();
      var bounds;

      var getAddressForLatLng = function (latLngObj) {
        var deferred = $q.defer();
        var latlng = new google.maps.LatLng(latLngObj.lat, latLngObj.lng);
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              $log.log(results[1].formatted_address);
              deferred.resolve(results[1].formatted_address);
            } else {
              $log.log('Location not found');
              deferred.reject();
            }
          } else {
            $log.log('Geocoder failed due to: ' + status);
            deferred.reject();
          }
        });
        return deferred.promise;
      };

      var getPlaceIdForLatLng = function (latLngObj) {
        var deferred = $q.defer();
        var latlng = new google.maps.LatLng(latLngObj.lat, latLngObj.lng);
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              $log.log(results[1].place_id);
              deferred.resolve(results[1].place_id);
            } else {
              deferred.reject();
            }
          } else {
            $log.log('Geocoder failed due to: ' + status);
            deferred.reject();
          }
        });
        return deferred.promise;
      };

      var getPostalCodeForLatLng = function (latLngObj) {
        var deferred = $q.defer();
        var zipcode;
        var latlng = new google.maps.LatLng(latLngObj.lat, latLngObj.lng);
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            $log.log('results ', results);
            var placesPostal = results[0].address_components;
            var len = placesPostal.length;
            for (var i = 0; i < len; i++ ) {
              if (placesPostal[i].types[0] === 'postal_code') {
                zipcode =  placesPostal[i].short_name;
                $log.log(placesPostal[i].short_name);
              }
            }
            if (zipcode) {
              deferred.resolve(zipcode);
            } else {
              $log.log('Location not found');
              deferred.reject();
            }
          } else {
            $log.log('Geocoder failed due to: ' + status);
            deferred.reject();
          }
        });
        return deferred.promise;
      };

      var addMarkers = function (markersData, map, callbackFn) {
        $log.log('addMarkers ', markersData);
        google.maps.event.addListener(map, 'click', function () {
          infoWindow.close();
        });

        bounds = new google.maps.LatLngBounds();

          // For loop that runs through the info on markersData making it possible to createMarker function to create the markers
        for (var i = 0; i < markersData.length; i++) {

          var latlng = new google.maps.LatLng(markersData[i].lat, markersData[i].lng);
          var name = markersData[i].name;
          var address1 = markersData[i].address;
          var address2 = markersData[i].city;
          var postalCode = markersData[i].zipcode;
          var venueKey = markersData[i].key;

          createMarker(map, latlng, name, address1, address2, postalCode, venueKey, callbackFn);

          bounds.extend(latlng);
        }

        map.fitBounds(bounds);
      };
      function createMarker (map, latlng, name, address1, address2, postalCode, venueKey, callbackFn) {
        var marker = new google.maps.Marker({
          map: map,
          position: latlng,
          title: name
        });

        google.maps.event.addListener(marker, 'mousedown', function () {

                // Variable to define the HTML content to be inserted in the infowindow
          var iwContent = '<div id="iw_container">' +
                    '<div class="iw_title">' + name + '</div>' +
                    '<div class="iw_content">' + address1 + '<br />' +
                    address2 + '<br />' +
                    postalCode + '<br />' +
                   '</div></div>';

                // including content to the infowindow
          infoWindow.setContent(iwContent);

              // opening the infowindow in the current map and at the current marker location
          callbackFn(venueKey);
          infoWindow.open(map, marker);
        });
      }
      var panToBounds = function (map) {
        $log.log('panToBounds ', map, 'bounds ', bounds);
        infoWindow.close();
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      };

      var getDistance = function (orgLatLng, destLatLng ) {
        var deferred = $q.defer();
        var orgin = new google.maps.LatLng(orgLatLng.lat, orgLatLng.lng);
        var destination =  new google.maps.LatLng(destLatLng.lat, destLatLng.lng);
        var request = {
          origins: [orgin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING
        };
        distMatrix.getDistanceMatrix(request, function (response, status) {

          if (status === google.maps.GeocoderStatus.OK) {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
            var dMatrix;
            for (var i = 0; i < origins.length; i++) {
              var results = response.rows[i].elements;

              for (var j = 0; j < results.length; j++) {
                var element = results[j];
                dMatrix = {
                  distance: element.distance.text,
                  duration: element.duration.text,
                  from: origins[i],
                  to: destinations[j]
                };
              }
            }

            deferred.resolve(dMatrix);

          } else {
            deferred.reject();
          }

        });
        return deferred.promise;
      };

      return {
        getAddressForLatLng: getAddressForLatLng,
        getPostalCodeForLatLng: getPostalCodeForLatLng,
        getPlaceIdForLatLng: getPlaceIdForLatLng,
        addMarkers: addMarkers,
        panToBounds: panToBounds,
        getDistance: getDistance

      };
    });
