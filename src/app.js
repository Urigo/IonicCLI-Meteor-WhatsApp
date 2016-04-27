import Angular from 'angular';
import Ionic from 'ionic';
import Keyboard from 'cordova/keyboard';
import StatusBar from 'cordova/status-bar';

import Loader from './loader';
import ChatCtrl from './controllers/chat.controller';
import ChatsCtrl from './controllers/chats.controller';
import LoginCtrl from './controllers/login.controller';
import InputDirective from './directives/input.directive';
import CalendarFilter from './filters/calendar.filter';
import { RoutesConfig, RoutesRunner } from './routes';

export const App = Angular.module('whatsapp', [
  'angular-meteor',
  'angular-meteor.auth',
  'angularMoment',
  'ionic'
]);

new Loader(App)
  .load(ChatCtrl)
  .load(ChatsCtrl)
  .load(LoginCtrl)
  .load(InputDirective)
  .load(CalendarFilter)
  .load(RoutesConfig)
  .load(RoutesRunner);

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
