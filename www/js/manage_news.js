// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('news2', ['starter'])
.controller('NewsCtrl2', function($scope, $window, $http, $cordovaGeolocation, $ionicModal, $sce) {
  var uniq_code = $window.sessionStorage.getItem("uniq_id");

  function getNews() {
    $scope.news = {};
    var res = $http({
      method: "GET",
      url: "http://api.payslip.triedgetechnology.com.sg/company_news",
      headers: {
        'uniq_id': uniq_code
      }
    })
    res.success(function(data, status, header, config) {
      console.log(data);
      if (data.code == 0) {
        $scope.news = data.news;
      }
    });
    res.error(function(data, status, header, config) {
      console.log(data);
    });
  }
  $scope.uploadNews = function() {
    var res = $http({
      method: "POST",
      url: "http://api.payslip.triedgetechnology.com.sg/company_news",
      data: {
        title: "test News",
        url: "http://www.pdf995.com/samples/pdf.pdf"
      },
            headers: {
              'uniq_id': uniq_code
            }
    })
    res.success(function(data, status, header, config) {
      console.log(data);

    });
    getNews();
  }
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.showNews = function(index) {
    var url = $scope.news[index].url;
    url = "http://docs.google.com/gview?url=" + url + '&embedded=true';
    console.log(url);
    $scope.news_url = $sce.trustAsResourceUrl(url);
    $scope.modal.show();
  }
  getNews();
});