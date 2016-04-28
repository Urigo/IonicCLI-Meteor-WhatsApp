import Angular from 'angular';
import Ionic from 'ionic';
import Keyboard from 'cordova/keyboard';
import StatusBar from 'cordova/status-bar';

import Loader from './loader';
import ChatCtrl from './controllers/chat.controller';
import ChatsCtrl from './controllers/chats.controller';
import ConfirmationCtrl from './controllers/confirmation.controller';
import LoginCtrl from './controllers/login.controller';
import NewChatCtrl from './controllers/new-chat.controller';
import ProfileCtrl from './controllers/profile.controller';
import SettingsCtrl from './controllers/settings.controller';
import InputDirective from './directives/input.directive';
import CalendarFilter from './filters/calendar.filter';
import NewChatService from './services/new-chat.service';
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
  .load(ConfirmationCtrl)
  .load(LoginCtrl)
  .load(NewChatCtrl)
  .load(ProfileCtrl)
  .load(SettingsCtrl)
  .load(InputDirective)
  .load(CalendarFilter)
  .load(NewChatService)
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
