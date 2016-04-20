import Angular from 'angular';
import Ionic from 'ionic';
import Keyboard from 'cordova/keyboard';
import StatusBar from 'cordova/status-bar';

export const App = Angular.module('whatsapp', [
  'ionic'
]);

Ionic.Platform.ready(() => {
  if (Keyboard) {
    Keyboard.hideKeyboardAccessoryBar(true);
    Keyboard.disableScroll(true);
  }

  if (StatusBar) {
    StatusBar.styleLightContent();
  }

  Angular.bootstrap(document, ['whatsapp']);
});
