// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('translate', ['ionic', 'pascalprecht.translate']).run(function($window, $translate) {
  $translate.use($window.sessionStorage.getItem("usingLan"));
}).config(['$translateProvider', function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
      prefix: 'locales/',
      suffix: '.json'
    }).registerAvailableLanguageKeys(['english', 'chinese'], {
      'en': 'english',
      'en_GB': 'english',
      'en_US': 'english',
      'cn': 'chinese',
      'zh_CN': 'chinese',
      'zh_SG': 'chinese'
    }).preferredLanguage('english')
    //.fallbackLanguage('english')
    //.determinePreferredLanguage()
    //.useSanitizeValueStrategy('escapeParameters');
}]).service('switchLan', function($ionicPopup, $translate, $window) {
  this.nowLan = updateLan;
  function updateLan(callback) {
    var currentLan = $translate.use();
        if (currentLan == 'english') {
          $translate.use('cn');
          $window.sessionStorage.setItem("usingLan", 'cn');
          callback('chinese');
        } else {
          $translate.use('en');
          $window.sessionStorage.setItem("usingLan", 'en');
          callback('english');
        }
  }
});