var camelCase = require('lodash.camelcase');
var upperFirst = require('lodash.upperfirst');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname + '/www/js',
    filename: 'app.bundle.js'
  },
  externals: [
    {
      'angular': 'angular',
      'cordova': 'cordova',
      'ionic': 'ionic'
    },
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
    plugin = camelCase(plugin);
    plugin = upperFirst(plugin);
    callback(null, 'this.cordova && cordova.plugins && cordova.plugins.' + plugin);
    return true;
  }
}