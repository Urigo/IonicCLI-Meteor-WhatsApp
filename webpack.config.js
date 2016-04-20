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
    extensions: ['', '.js']
  },
  alias: {
    lib: __dirname + '/www/lib'
  }
};

function resolveExternals(context, request, callback) {
  return cordovaPlugin(request, callback) ||
         callback();
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