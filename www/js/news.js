// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('news', ['starter']).controller('NewsCtrl', function($scope, $window, $ionicModal, $sce, switchLan, $translate) {
  $scope.nowLan = $translate.proposedLanguage();
  $scope.goHome = function() {
    $window.location.href = 'main.html';
  }
  $scope.logout = function() {
    $window.location.href = 'index.html';
  }
  $scope.selectLan = function() {
    switchLan.nowLan(function(data) {
      $scope.nowLan = data;
    });
  }
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.showNews = function() {
    $scope.news_url = $sce.trustAsResourceUrl('http://docs.google.com/gview?url=http://www.pdf995.com/samples/pdf.pdf&embedded=true');
    $scope.modal.show();
  }
});