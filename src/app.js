import Angular from 'angular';
import Ionic from 'ionic';
import Keyboard from 'cordova/keyboard';
import StatusBar from 'cordova/status-bar';
import Loader from 'angular-ecmascript/module-loader';

import ChatsCtrl from './controllers/chats.controller';
import RoutesConfig from './routes';

const App = 'whatsapp';

Angular.module(App, [
  'ionic'
]);

new Loader(App)
  .load(ChatsCtrl)
  .load(RoutesConfig);

Ionic.Platform.ready(() => {
  if (Keyboard) {
    Keyboard.hideKeyboardAccessoryBar(true);
    Keyboard.disableScroll(true);
  }

  if (StatusBar) {
    StatusBar.styleLightContent();
  }

  Angular.bootstrap(document, [App]);
});
