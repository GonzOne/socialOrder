'use strict';
angular.module('main')
.filter('daysInMonth', function () {
  return function (days, year, month) {
    var filtered = [];
    angular.forEach(days, function (day) {
      if (month !== '') {
        if (month.id === 1 || month.id === 3 || month.id === 5 || month.id === 7 || month.id === 8 || month.id === 10 || month.id === 12) {
          filtered.push(day);
        }
        else if ((month.id === 4 || month.id === 6 || month.id === 9 || month.id === 11) && day <= 30) {
          filtered.push(day);
        }
        else if (month.id === 2) {
          if (year % 4 === 0 && day <= 29) {
            filtered.push(day);
          }
           else if (day <= 28) {
             filtered.push(day);
           }
        }
      }
    });
    return filtered;
  };
});
angular.module('main')
    .filter('validMonths', function () {
      return function (months, year) {
        var filtered = [];
        var now = new Date();
        var over18Month = now.getUTCMonth() + 1;
        var over21Year = now.getUTCFullYear() - 21;
        if (year !== '') {
          if (year === over21Year) {
            angular.forEach(months, function (month) {
              if (month.id <= over18Month) {
                filtered.push(month);
              }
            });
          }
          else {
            angular.forEach(months, function (month) {
              filtered.push(month);
            });
          }
        }
        return filtered;
      };

    });
angular.module('main')
    .filter('validDays', function () {
      return function (days, year, month) {
        var filtered = [];
        var now = new Date();
        var over18Day = now.getUTCDate();
        var over18Month = now.getUTCMonth() + 1;
        var over21Year = now.getUTCFullYear() - 21;
        if (year === over21Year && month.id === over18Month) {
          angular.forEach(days, function (day) {
            if (day <= over18Day) {
              filtered.push(day);
            }
          });
        }
        else {
          angular.forEach(days, function (day) {
            filtered.push(day);
          });
        }
        return filtered;
      };
    });

