// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'translate', 'ngCordova']).run(function($ionicPlatform, $ionicPopup, $translate) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { // your check here
      $ionicPopup.confirm({
        title: $translate.instant('System warning'),
        template: $translate.instant('Are you sure you want to exit?'),
        okText: $translate.instant('OK'),
        cancelText: $translate.instant('Cancel')
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);
}).controller('LoginCtrl', function($scope, $ionicPopup, $window, $http, switchLan, $translate, $cordovaDevice) {
  var platform = '';
  var uuid = '';
  $window.sessionStorage.setItem("app_version", '1.0');
  document.addEventListener("deviceready", function() {
    platform = $cordovaDevice.getPlatform();
    $window.sessionStorage.setItem("device_type", platform);
    uuid = $cordovaDevice.getUUID();
    $window.sessionStorage.setItem("device_id", uuid);
  }, false);
  $scope.nowLan = $translate.proposedLanguage();
  $scope.data = [];
  $scope.login = function() {
    var hash = CryptoJS.SHA1($scope.data.password);
    $scope.password = hash.toString(CryptoJS.enc.Hex);
    var dataObj = {
      login_id: $scope.data.username,
      pwd: $scope.password,
      device_id: uuid,
      device_type: platform,
      app_version: '1.0'
    }
    var res = $http({
      method: "POST",
      url: "http://api.payslip.triedgetechnology.com.sg/login",
      data: dataObj
    })
    res.success(function(data, status, header, config) {
      console.log(data);
      if (data.code == 0) {
        $window.sessionStorage.setItem("username", $scope.data.username);
        $window.sessionStorage.setItem("need_update", data.need_update);
        $window.sessionStorage.setItem("permission", data.permission[0]);
        $window.sessionStorage.setItem("uniq_id", data.uniq_id);
        $window.location.href = 'main.html';
        /*
        var alertPopup = $ionicPopup.alert({
          title: $translate.instant('Login successfully!'),
          template: $translate.instant('You can use the system now!'),
          okText: $translate.instant('OK')
        });
        alertPopup.then(function(res) {
          $window.location.href = 'main.html';
        });
        */
      } else $ionicPopup.alert({
        title: $translate.instant('Login failed!'),
        template: $translate.instant('Please check your credentials!'),
        okText: $translate.instant('OK')
      });
    });
    res.error(function(data, status, header, config) {
      var alertPopup = $ionicPopup.alert({
        title: $translate.instant('Login failed!'),
        template: $translate.instant('Please check your internet connection!'),
        okText: $translate.instant('OK')
      });
    });
  }
  $scope.selectLan = function() {
    switchLan.nowLan(function(data) {
      $scope.nowLan = data;
    });
  }
  $scope.reset = function() {
    $ionicPopup.prompt({
      title: $translate.instant('Reset Password'),
      template: $translate.instant('Enter your NRIC number'),
      okText: $translate.instant('OK'),
      cancelText: $translate.instant('Cancel')
        //inputType: 'password',
        //inputPlaceholder: 'Your password'
    }).then(function(res) {
      console.log('Your password is', res);
      if (res != null) {
        var dataObj = {
          nric: res,
          device_id: uuid,
          device_type: platform,
          app_version: '1.0'
        }
        var res = $http({
          method: "POST",
          url: "http://api.payslip.triedgetechnology.com.sg/resetpassword",
          data: dataObj
        })
        res.success(function(data, status, header, config) {
          alert($translate.instant('Please contact HR for your new password'));
          console.log(data);
        });
        res.error(function(data, status, header, config) {
          console.log(data);
        });
      }
    });
  }
});