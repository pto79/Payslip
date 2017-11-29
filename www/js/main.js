// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('main', ['starter']).controller('MainCtrl', function($scope, $window, switchLan, $translate, $ionicModal, $ionicSlideBoxDelegate, $timeout) {
  $scope.need_update = $window.sessionStorage.getItem("need_update");
  $scope.permission = $window.sessionStorage.getItem("permission");
  $scope.username = $window.sessionStorage.getItem("username");
  $scope.nowLan = $translate.proposedLanguage();
  $scope.logout = function() {
    $window.location.href = 'index.html';
  }
  $scope.selectLan = function() {
    switchLan.nowLan(function(data) {
      $scope.nowLan = data;
    });
  }
  $scope.aImages = [{
    'src': 'img/intro1.jpg',
    'msg': ''
  }];
  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $window.sessionStorage.setItem("adShown",1);
    $ionicSlideBoxDelegate.slide(0);
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.goToSlide = function(index) {
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    }
    // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  if($window.sessionStorage.getItem("adShown") == null) {
    $timeout($scope.openModal, 0);
  }
});