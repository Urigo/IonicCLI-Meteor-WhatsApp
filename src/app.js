import angular from 'angular';
import ionic from 'ionic';
import keyboard from 'cordova/keyboard';
import statusbar from 'cordova/status-bar';

export const App = angular.module('whatsapp', [
  'ionic'
]);

ionic.Platform.ready(() => {
  if (keyboard) {
    keyboard.hideKeyboardAccessoryBar(true);
    keyboard.disableScroll(true);
  }

  if (statusbar) {
    statusbar.styleLightContent();
  }

  angular.bootstrap(document, ['whatsapp']);
});
