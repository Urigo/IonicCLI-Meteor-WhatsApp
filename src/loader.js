import Angular from 'angular';
import * as Entities from './entities';

export default class Loader {
  constructor(module, dependencies) {
    if (typeof module == 'string') {
      module = Angular.module(module, dependencies);
    }

    this.module = module;
  }

  load(Entity, ...args) {
    if (typeof Entity == 'function') {
      const proto = Entity.prototype;
      Entity.$name = Entity.$name || Entity.name;
      Entity.$inject = Entity.$inject || [];

      if (proto instanceof Entities.Provider)
        this._loadProvider(Entity);
      else if (proto instanceof Entities.Service)
        this._loadService(Entity);
      else if (proto instanceof Entities.Controller)
        this._loadController(Entity);
      else if (proto instanceof Entities.Directive)
        this._loadDirective(Entity);
      else if (proto instanceof Entities.Decorator)
        this._loadDecorator(Entity);
      else if (proto instanceof Entities.Factory)
        this._loadFactory(Entity);
      else if (proto instanceof Entities.Filter)
        this._loadFilter(Entity);
      else if (proto instanceof Entities.Config)
        this._loadConfig(Entity);
      else if (proto instanceof Entities.Runner)
        this._loadRunner(Entity);
      else
        throw Error('can\'t load unknown entity type');
    }
    else {
      this.module[Entity](...args);
    }

    return this;
  }

  _loadProvider(Provider) {
    this.module.provider(Provider.$name, Provider);
  }

  _loadService(Service) {
    this.module.service(Service.$name, Service)
  }

  _loadController(Controller) {
    const $inject = Controller.$inject;

    if ($inject.indexOf('$scope') == -1) {
      $inject.unshift('$scope');
    }

    this.module.controller(Controller.$name, Controller);
  }

  _loadDirective(Directive) {
    function handler() {
      return new Directive(...arguments);
    }

    handler.$inject = Directive.$inject;
    this.module.directive(Directive.$name, handler);
  }

  _loadDecorator(Decorator) {
    function handler() {
      const decorator = new Decorator(...arguments);
      return decorator.decorate.bind(decorator);
    }

    handler.$inject = Decorator.$inject;
    this.module.decorator(Decorator.$name, handler);
  }

  _loadFactory(Factory) {
    function handler() {
      const factory = new Factory(...arguments);
      return factory.create.bind(factory);
    }

    handler.$inject = Factory.$inject;
    this.module.factory(Factory.$name, handler);
  }

  _loadFilter(Filter) {
    function handler() {
      const filter = new Filter(...arguments);
      return filter.filter.bind(filter);
    }

    handler.$inject = Filter.$inject;
    this.module.filter(Filter.$name, handler);
  }

  _loadConfig(Config) {
    function handler() {
      const config = new Config(...arguments);
      return config.configure();
    }

    handler.$inject = Config.$inject;
    this.module.config(handler);
  }

  _loadRunner(Runner) {
    function handler() {
      const runner = new Runner(...arguments);
      return runner.run();
    }

    handler.$inject = Runner.$inject;
    this.module.run(handler);
  }
}