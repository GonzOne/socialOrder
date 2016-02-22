'use strict';
angular.module('main')
    .factory('DateFormatter', function () {


      return {
        formatAMPM: function () {
          var time = new Date();
          var hours = time.getHours();
          var minutes = time.getMinutes();
          var ampm = hours >= 12 ? 'pm' : 'am';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0' + minutes : minutes;
          var strTime = hours + ':' + minutes + ' ' + ampm;
          return strTime;

        },
        formatMMDDYYYY: function () {
          var date = new Date();
          var dd = date.getDate();
          var mm = date.getMonth() + 1; //January is 0!
          var yyyy = date.getFullYear();

          if (dd < 10) {
            dd = '0' + dd;
          }
          if ( mm < 10) {
            mm = '0' + mm;
          }
          var strDate = mm + '/' + dd + '/' + yyyy;
          return strDate;
        },
        formatDD: function () {
          var date = new Date();
          var dd = date.getDate();
          if (dd < 10) {
            dd = '0' + dd;
          }
          return dd;
        },
        formatMM: function () {
          var date = new Date();
          var mm = date.getMonth() + 1;
          if ( mm < 10) {
            mm = '0' + mm;
          }
          return mm;
        },
        formatYYYY: function () {
          var date = new Date();
          var yyyy = date.getFullYear();
          return yyyy;
        }

      };
    });
