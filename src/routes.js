import { Config } from 'angular-ecmascript/module-helpers';

export default class RoutesConfig extends Config {
  static $inject = ['$stateProvider']

  configure() {
    this.$stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      });
  }
}