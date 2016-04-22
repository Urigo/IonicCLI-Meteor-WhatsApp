var camelCase = require('lodash.camelcase');
var upperFirst = require('lodash.upperfirst');
var path = require('path');

module.exports = {
  entry: [
    './src/app.js'
  ],
  output: {
    path: path.join(__dirname, './www/js'),
    filename: 'app.bundle.js'
  },
  externals: [
    {
      angular: true,
      cordova: true,
      ionic: true,
      moment: true
    },
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
    extensions: ['', '.js']
  }
};

function customExternals(context, request, callback) {
  return cordovaPlugin(request, callback) ||
         callback();
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