// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('attendance2', ['starter'])
.filter('min2hr', function() {
  return function(input) {
    var hr = '';
    var min = '';
    var out = '';
    hr = Math.floor(input / 60);
    min = input % 60;
    out = hr + 'H:' + min + 'M';
    return out;
  };
}).controller('AttendanceCtrl2', function($scope, $window, $http, $cordovaGeolocation, $ionicModal) {
  var uniq_code = $window.sessionStorage.getItem("uniq_id");

  function getAttendance() {
    $scope.attendances = {};
    var res = $http({
      method: "GET",
      url: "http://api.payslip.triedgetechnology.com.sg/attendance",
      headers: {
        'uniq_id': uniq_code
      }
    })
    res.success(function(data, status, header, config) {
      console.log(data);
      if (data.code == 0) {
        $scope.attendances = data.attendance
      }
    });
    res.error(function(data, status, header, config) {
      console.log(data);
    });
  }
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.showInLocation = function(index) {
    console.log($scope.attendances[index]);
    var record = $scope.attendances[index];
    var latitude = record.in_lat;
    var longitude = record.in_long;
    $scope.modal.show();
    var latLng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
    });
  }
  $scope.showOutLocation = function(index) {
    console.log($scope.attendances[index]);
    var record = $scope.attendances[index];
    var latitude = record.out_lat;
    var longitude = record.out_long;
    $scope.modal.show();
    var latLng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
    });
  }
  getAttendance();
});