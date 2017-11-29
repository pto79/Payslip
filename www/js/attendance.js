// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('attendance', ['starter']).controller('AttendanceCtrl', function($scope, $ionicPopup, $window, $http, $cordovaBarcodeScanner, $ionicPlatform, $cordovaGeolocation, switchLan, $translate) {
  var uniq_code = $window.sessionStorage.getItem("uniq_id");
  var device_id = $window.sessionStorage.getItem("device_id");
  var device_type = $window.sessionStorage.getItem("device_type");
  var app_version = $window.sessionStorage.getItem("app_version");
  $scope.nowLan = $translate.proposedLanguage();
  $scope.punches = [];
  var qrcode = '';
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
  $scope.scanBarcode = function() {
    $ionicPlatform.ready(function() {
      var str = new Date().toString();
      var nowTime = new Date().getTime();
      str = str.substring(0, str.indexOf("GMT"));
      console.log(str);
      console.log(nowTime);
      $cordovaBarcodeScanner.scan().then(function(imageData) {
        //var imageData = {text:'Clock-in'};
        if (imageData.text == 'Clock-in') {
          qrcode = 'abc123';
          //if ($window.sessionStorage.getItem("clockin_time") == null) {
          $scope.punches.push({
            entry: true,
            punch_time: str
          });
          //str = "Welcome to the company, now is " + str;
          //$window.sessionStorage.setItem("clockin_time", nowTime);
          //} else {
          //alert($translate.instant('You are scaning the wrong QR code'));
          //}
        } else if (imageData.text == 'Clock-off') {
          qrcode = 'abc456';
          //if ($window.sessionStorage.getItem("clockin_time") != null) {
          $scope.punches.push({
            entry: false,
            punch_time: str
          });
          //var worked_time = nowTime - $window.sessionStorage.getItem("clockin_time");
          //var seconds = Math.round(worked_time / 1000 % 60);
          //var minutes = Math.round(worked_time / 1000 / 60 % 60);
          //var hours = Math.round(worked_time / 1000 / 60 / 60 % 24);
          //str = "You have worked for " + hours + "h:" + minutes + "m:" + seconds + "s";
          //$window.sessionStorage.removeItem("clockin_time");
          //} else {
          //alert($translate.instant('You are scaning the wrong QR code'));
          //}
        }
        //alert(str);
        //console.log("Barcode Format -> " + imageData.format);
        //console.log("Cancelled -> " + imageData.cancelled);
	//error return for scan barcode
      }, function(error) {
        console.log("An error happened -> " + error);
      });
      var posOptions = {
        timeout: 50000,
        enableHighAccuracy: false
      };
      $cordovaGeolocation.getCurrentPosition().then(function(position) {
        var lat = position.coords.latitude
        var long = position.coords.longitude
        console.log(lat);
        console.log(long);
        //alert("location acquired.");
        var dataObj = {
          qrcode: qrcode,
          longtitude: long,
          lattitude: lat,
          device_id: device_id,
          device_type: device_type,
          version: app_version
        }
        var res = $http({
          method: "POST",
          url: "http://api.payslip.triedgetechnology.com.sg/attendance",
          data: dataObj,
          headers: {
            'uniq_id': uniq_code
          }
        })
        res.success(function(data, status, header, config) {
          console.log(data);
          if (data.code == 0) {
            alert($translate.instant(data.msg));
          } else {
            alert($translate.instant(data.msg));
          }
        });
	//error return for send attendance
        res.error(function(data, status, header, config) {});
                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
	//error return for get location
      }, function(err) {
        // error
        console.log("Could not get location with error code:" + err.code);
      });
    });
  };
});