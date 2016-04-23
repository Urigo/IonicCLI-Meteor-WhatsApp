var _ = require('lodash');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + '/www/js',
    filename: 'app.bundle.js'
  },
  externals: [
    require('./www/lib/exports'),
    resolveExternals
  ],
  target: 'web',
  devtool: 'source-map',
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['add-module-exports']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|www)/,
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      lib: __dirname + '/www/lib',
      api: __dirname + '/api/server'
    }
  }
};

function resolveExternals(context, request, callback) {
  return meteorPack(request, callback) ||
         cordovaPlugin(request, callback) ||
         callback();
}

function meteorPack(request, callback) {
  var match = request.match(/^meteor\/(.+)$/);
  var pack = match && match[1];

  if (pack) {
    callback(null, 'Package["' + pack + '"]' );
    return true;
  }
}

function cordovaPlugin(request, callback) {
  var match = request.match(/^cordova\/(.+)$/);
  var plugin = match && match[1];

  if (plugin) {
    plugin = _.chain(plugin).camelCase().upperFirst().value();
    callback(null, 'this.cordova && cordova.plugins && cordova.plugins.' + plugin);
    return true;
  }
}