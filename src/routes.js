import { Config } from './entities';

export default class RoutesConfig extends Config {
  static $inject = ['$stateProvider', '$urlRouterProvider']

  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chats.html',
            controller: 'ChatsCtrl as chats'
          }
        }
      })
      .state('tab.chat', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat.html',
            controller: 'ChatCtrl as chat'
          }
        }
      });

    this.$urlRouterProvider.otherwise('tab/chats');
  }
}