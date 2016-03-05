'use strict';

function SoProductBoxController () {
  var vm = this;
  vm.showComment = false;
  //export
  vm.toggle = toggle;
  vm.add = add;
  function toggle () {
    vm.showComment = !vm.showComment;
  }
  function add () {
    if (vm.quantity < vm.max) {
      vm.quantity++;
      vm.addFn({indx: vm.index, comment: vm.comment});
    }

  }
}

function soProductBox () {

  return {
    restrict: 'E',
    scope: {},
    controller: 'SoProductBoxController',
    controllerAs: 'soProductBoxController',
    bindToController: {
      name: '@',
      price: '@',
      desc: '@',
      comment: '@',
      max: '@',
      quantity: '@',
      index: '@',
      addFn: '&'
    },
    templateUrl: './main/templates/directives/product/product.directive.view.html'
  };
}


angular
    .module('main')
    .directive('soProductBox', soProductBox)
    .controller('SoProductBoxController', SoProductBoxController);
