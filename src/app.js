import angular from 'angular';
import ionic from 'ionic';
import keyboard from 'cordova/keyboard';
import statusbar from 'cordova/status-bar';

import Loader from './loader';
import RoutesConfig from './routes';

export const App = angular.module('whatsapp', [
  'ionic'
]);

new Loader(App)
  .load(RoutesConfig);

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
