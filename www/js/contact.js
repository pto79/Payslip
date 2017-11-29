// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('contact', ['starter', 'ngFileUpload']).controller('ContactCtrl', function($scope, $http, $window, $ionicModal, $ionicPlatform, switchLan, Upload, $translate, $ionicPopup) {
  var uniq_code = $window.sessionStorage.getItem("uniq_id");
  $scope.username = $window.sessionStorage.getItem("username");
  $scope.nowLan = $translate.proposedLanguage();
  $scope.collection = [];
  var attachment = [];
  var contactDetails;
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
  $scope.selectImage = function(file) {
    if (file != null) {
      console.log(file);
      $scope.collection.push(file);
      console.log($scope.collection);
    }
  };
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.showPic = function(index) {
    $scope.indexOfImage = index;
    $scope.modal.show();
  }

  function sendEmail() {
    var res = $http({
      method: "POST",
      url: "http://api.payslip.triedgetechnology.com.sg/email",
      data: {
        uniq_id: uniq_code,
        to: 'pto_by@hotmail.com',
        subject: contactDetails.type,
        text: contactDetails.note,
        html: contactDetails.note,
        attachments: attachment
      }
    })
    res.success(function(data, status, header, config) {
      console.log(data);
      if (data.code == 0) alert($translate.instant('Email sent'));
      else alert($translate.instant('Email sending failed'));
    });
  }
  $scope.submitContact = function(c) {
    contactDetails = c;
    contactDetails.note += '<p> Sent from ' + $scope.username;
    var files = $scope.collection;
    if (files && files.length) {
      var uploaded = [];
      var key = '';
      var keyname = '';
      var filename = '';
      attachment = [];
      Upload.upload({
        url: 'http://api.payslip.triedgetechnology.com.sg/upload',
        data: {
          files: files
        },
        headers: {
          'uniq_id': uniq_code
        }
      }).then(function(response) {
        console.log(response);
        uploaded = response.data.uploaded;
        key = response.data.key;
        for (var i in uploaded) {
          keyname = uploaded[i].toString();
          filename = keyname.slice(key.length + 1);
          keyname = "http://api.payslip.triedgetechnology.com.sg/file/" + keyname;
          attachment.push({
            'filename': filename,
            'path': keyname
          });
        }
        console.log(attachment);
        sendEmail();
        //upload fail
      }, function(response) {
        console.log(response);
        alert($translate.instant('Photo uploading failed'));
      }, function(evt) {
        $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    } else {
      sendEmail();
    }
  }
  $scope.delImage = function(index) {
    var confirmPopup = $ionicPopup.confirm({
      //title: $translate.instant('Current language is ' + currentLan),
      template: $translate.instant('Do you want to delete this photo?'),
      okText: $translate.instant('OK'),
      cancelText: $translate.instant('Cancel')
    });
    confirmPopup.then(function(res) {
      if (res) {
        $scope.collection.splice(index, 1);
        $scope.modal.hide();
      }
    });
  }
});