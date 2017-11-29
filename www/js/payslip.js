// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('payslip', ['starter']).controller('PayslipCtrl', function($scope, $window, switchLan, $translate, $cordovaFile) {
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
  $scope.update = function() {}
  $scope.capture = function() {
    html2canvas(document.getElementById('exportthis'), {
      background: '#FFFFFF',
      onrendered: function(canvas) {
        var data = canvas.toDataURL();
        var docDefinition = {
          content: [{
            image: data,
            width: 500,
          }]
        };
        $scope.canvasData = data;
        console.log(data)
          /** Process the type1 base64 string **/
        var myBaseString = data;
        // Split the base64 string in data and contentType
        var block = myBaseString.split(";");
        // Get the content type
        var dataType = block[0].split(":")[1]; // In this case "image/png"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."
        // The path where the file will be created
        var folderpath = cordova.file.externalRootDirectory + "DCIM/";
        // The name of your file, note that you need to know if is .png,.jpeg etc
        var filename = "myimage.png";
        var base64Blob = base64toBlob(realData, dataType);
        $cordovaFile.writeFile(folderpath, filename, base64Blob, true).then(function(success) {
          console.log(success);
        }, function(error) {
          console.log(error);
        })
      }
    });
  }

  function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);
    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);
      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, {
      type: contentType
    });
  }
});