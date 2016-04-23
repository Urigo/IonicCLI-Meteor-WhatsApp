var _ = require('lodash');
var path = require('path');

module.exports = {
  entry: [
    './server/common.js',
    './src/app.js'
  ],
  output: {
    path: path.join(__dirname, './www/js'),
    filename: 'app.bundle.js'
  },
  externals: [
    require('./www/lib/exports'),
    customExternals
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
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {
      server: path.join(__dirname, 'server')
    }
  }
};

function customExternals(context, request, callback) {
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