import Angular from 'angular';
import Ionic from 'ionic';
import Keyboard from 'cordova/keyboard';
import StatusBar from 'cordova/status-bar';

import Loader from './loader';
import ChatsCtrl from './controllers/chats.controller';
import CalendarFilter from './filters/calendar.filter';
import RoutesConfig from './routes';

export const App = Angular.module('whatsapp', [
  'angular-meteor',
  'ionic'
]);

new Loader(App)
  .load(ChatsCtrl)
  .load(CalendarFilter)
  .load(RoutesConfig);

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
