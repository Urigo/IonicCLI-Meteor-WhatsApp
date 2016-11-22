[{]: <region> (header)
# Step 1: Bundling
[}]: #
[{]: <region> (body)
In this tutorial we will write our app using `ecmascript6` javascript, which is the latest version of javascript updated with the new ecmascript standards (From now on we will refer it as 'es6'). So before we dive into building our app, we need to make an initial setup inorder to achieve that.

Iorder to write some es6 code we will need a pre-processor. [babel](https://babeljs.io/) plays a perfect roll for that. But that's not all. One of the most powerful tools in es6 is the module system. It uses relative paths inorder to load different modules we implement. `babel` can't do that alone because it can't load relative modules using sytax only. We will need some sort of a module bundler.

That's where [Webpack](https://webpack.github.io/) kicks in. `Webpack` is just a module bundler, but it can also use pre-processors on the way and it can be easily configured by whatever rules we specify, and is a very powerful tool and is being used very commonly.

`Meteor` also uses the same techniques to implement es6, and load `npm` modules into client side code, but since we're using `Ionic` cli and not `Meteor`, we will implement our own `Webpack` configuration, using our own rules!

Great, now that we have the idea of what `Webpack` is all about, let's setup our initial config:

[{]: <helper> (diff_step 1.1)
#### Step 1.1: Add webpack config

##### Added webpack.config.js
```diff
@@ -0,0 +1,56 @@
+┊  ┊ 1┊var camelCase = require('lodash.camelcase');
+┊  ┊ 2┊var upperFirst = require('lodash.upperfirst');
+┊  ┊ 3┊
+┊  ┊ 4┊module.exports = {
+┊  ┊ 5┊  entry: [
+┊  ┊ 6┊    './src/index.js'
+┊  ┊ 7┊  ],
+┊  ┊ 8┊  output: {
+┊  ┊ 9┊    path: __dirname + '/www/js',
+┊  ┊10┊    filename: 'app.bundle.js'
+┊  ┊11┊  },
+┊  ┊12┊  externals: [
+┊  ┊13┊    {
+┊  ┊14┊      'angular': 'angular',
+┊  ┊15┊      'cordova': 'cordova',
+┊  ┊16┊      'ionic': 'ionic'
+┊  ┊17┊    },
+┊  ┊18┊    resolveExternals
+┊  ┊19┊  ],
+┊  ┊20┊  target: 'web',
+┊  ┊21┊  devtool: 'source-map',
+┊  ┊22┊  babel: {
+┊  ┊23┊    presets: ['es2015', 'stage-0'],
+┊  ┊24┊    plugins: ['add-module-exports']
+┊  ┊25┊  },
+┊  ┊26┊  module: {
+┊  ┊27┊    loaders: [{
+┊  ┊28┊      test: /\.js$/,
+┊  ┊29┊      exclude: /(node_modules|www)/,
+┊  ┊30┊      loader: 'babel'
+┊  ┊31┊    }]
+┊  ┊32┊  },
+┊  ┊33┊  resolve: {
+┊  ┊34┊    extensions: ['', '.js'],
+┊  ┊35┊    alias: {
+┊  ┊36┊      lib: __dirname + '/www/lib'
+┊  ┊37┊    }
+┊  ┊38┊  }
+┊  ┊39┊};
+┊  ┊40┊
+┊  ┊41┊function resolveExternals(context, request, callback) {
+┊  ┊42┊  return cordovaPlugin(request, callback) ||
+┊  ┊43┊         callback();
+┊  ┊44┊}
+┊  ┊45┊
+┊  ┊46┊function cordovaPlugin(request, callback) {
+┊  ┊47┊  var match = request.match(/^cordova\/(.+)$/);
+┊  ┊48┊  var plugin = match && match[1];
+┊  ┊49┊
+┊  ┊50┊  if (plugin) {
+┊  ┊51┊    plugin = camelCase(plugin);
+┊  ┊52┊    plugin = upperFirst(plugin);
+┊  ┊53┊    callback(null, 'this.cordova && cordova.plugins && cordova.plugins.' + plugin);
+┊  ┊54┊    return true;
+┊  ┊55┊  }
+┊  ┊56┊}🚫↵
```
[}]: #

> *NOTE*: Since we don't want to digress from this tutorial's subject, we won't go into details about `Webpack`'s config. For more information, see [reference](https://webpack.github.io/docs/configuration.html).

We would also like to initiate `Webpack` once we build our app. All our tasks are defined in one file called `gulpfile.js`, which uses [gulp](http://gulpjs.com/)'s API to perform and chain them.

Let's edit our `gulpfile.js` accordingly:

[{]: <helper> (diff_step 1.2)
#### Step 1.2: Add webpack task to gulpfile

##### Changed gulpfile.js
```diff
@@ -6,12 +6,30 @@
 ┊ 6┊ 6┊var minifyCss = require('gulp-minify-css');
 ┊ 7┊ 7┊var rename = require('gulp-rename');
 ┊ 8┊ 8┊var sh = require('shelljs');
+┊  ┊ 9┊var webpack = require('webpack');
+┊  ┊10┊
+┊  ┊11┊var webpackConfig = require('./webpack.config');
 ┊ 9┊12┊
 ┊10┊13┊var paths = {
+┊  ┊14┊  webpack: ['./src/**/*.js', '!./www/lib/**/*'],
 ┊11┊15┊  sass: ['./scss/**/*.scss']
 ┊12┊16┊};
 ┊13┊17┊
-┊14┊  ┊gulp.task('default', ['sass']);
+┊  ┊18┊gulp.task('default', ['webpack', 'sass']);
+┊  ┊19┊
+┊  ┊20┊gulp.task('webpack', function(done) {
+┊  ┊21┊  webpack(webpackConfig, function(err, stats) {
+┊  ┊22┊    if (err) {
+┊  ┊23┊      throw new gutil.PluginError('webpack', err);
+┊  ┊24┊    }
+┊  ┊25┊
+┊  ┊26┊    gutil.log('[webpack]', stats.toString({
+┊  ┊27┊      colors: true
+┊  ┊28┊    }));
+┊  ┊29┊
+┊  ┊30┊    done();
+┊  ┊31┊  });
+┊  ┊32┊});
 ┊15┊33┊
 ┊16┊34┊gulp.task('sass', function(done) {
 ┊17┊35┊  gulp.src('./scss/ionic.app.scss')
```
```diff
@@ -27,6 +45,7 @@
 ┊27┊45┊});
 ┊28┊46┊
 ┊29┊47┊gulp.task('watch', function() {
+┊  ┊48┊  gulp.watch(paths.webpack, ['webpack']);
 ┊30┊49┊  gulp.watch(paths.sass, ['sass']);
 ┊31┊50┊});
```
[}]: #

From now on all our client code will be written in the `./src` folder, and `Gulp` should automatically detect changes in our files and re-build them once our app is running.

> *NOTE*: Again, we would like to focus on building our app rather than expalining about 3rd party libraties. For more information about tasks in `Gulp` see [reference](https://github.com/gulpjs/gulp/blob/master/docs/API.md).

And last but not least, let's install the necessary dependencies inorder to make our setup work. Run:

    $ npm install babel --save
    $ npm install babel-core --save
    $ npm install babel-loader --save
    $ npm install babel-plugin-add-module-exports --save
    $ npm install babel-preset-es2015 --save
    $ npm install babel-preset-stage-0 --save
    $ npm install expose-loader --save
    $ npm install lodash.camelcase --save
    $ npm install lodash.upperfirst --save
    $ npm install script-loader --save
    $ npm install webpack --save

> *TIP*: You can also write it as a single line using `npm i <package1> <package2> ... --save`.

Our `package.json` should look like this:

[{]: <helper> (diff_step 1.3)
#### Step 1.3: Install webpack dependencies

##### Changed package.json
```diff
@@ -3,11 +3,22 @@
 ┊ 3┊ 3┊  "version": "1.1.1",
 ┊ 4┊ 4┊  "description": "whatsapp: An Ionic project",
 ┊ 5┊ 5┊  "dependencies": {
+┊  ┊ 6┊    "babel": "^6.5.2",
+┊  ┊ 7┊    "babel-core": "^6.7.6",
+┊  ┊ 8┊    "babel-loader": "^6.2.4",
+┊  ┊ 9┊    "babel-plugin-add-module-exports": "^0.1.2",
+┊  ┊10┊    "babel-preset-es2015": "^6.6.0",
+┊  ┊11┊    "babel-preset-stage-0": "^6.5.0",
+┊  ┊12┊    "expose-loader": "^0.7.1",
 ┊ 6┊13┊    "gulp": "^3.5.6",
-┊ 7┊  ┊    "gulp-sass": "^2.0.4",
 ┊ 8┊14┊    "gulp-concat": "^2.2.0",
 ┊ 9┊15┊    "gulp-minify-css": "^0.3.0",
-┊10┊  ┊    "gulp-rename": "^1.2.0"
+┊  ┊16┊    "gulp-rename": "^1.2.0",
+┊  ┊17┊    "gulp-sass": "^2.0.4",
+┊  ┊18┊    "lodash.camelcase": "^4.1.1",
+┊  ┊19┊    "lodash.upperfirst": "^4.2.0",
+┊  ┊20┊    "script-loader": "^0.7.0",
+┊  ┊21┊    "webpack": "^1.13.0"
 ┊11┊22┊  },
 ┊12┊23┊  "devDependencies": {
 ┊13┊24┊    "bower": "^1.3.3",
```
```diff
@@ -23,4 +34,4 @@
 ┊23┊34┊    "ionic-plugin-keyboard"
 ┊24┊35┊  ],
 ┊25┊36┊  "cordovaPlatforms": []
-┊26┊  ┊}🚫↵
+┊  ┊37┊}
```
[}]: #

`Ionic` provides us with a very nice skelton for building our app. But we would like to use a different method which is a little more advanced which will help us write some es6 code properly.

Thus, we shall clean up some files from our project, just run:

    $ cd ./www
    $ rm -rf ./css
    $ rm -rf ./img
    $ rm -rf ./js
    $ rm -rf ./templates

Next, we will setup our `index.html`:

[{]: <helper> (diff_step 1.5)
#### Step 1.5: Setup index.html for app

##### Changed www/index.html
```diff
@@ -3,27 +3,19 @@
 ┊ 3┊ 3┊  <head>
 ┊ 4┊ 4┊    <meta charset="utf-8">
 ┊ 5┊ 5┊    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
-┊ 6┊  ┊    <title></title>
+┊  ┊ 6┊    <title>whatapp</title>
 ┊ 7┊ 7┊
-┊ 8┊  ┊    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
-┊ 9┊  ┊    <link href="css/style.css" rel="stylesheet">
-┊10┊  ┊
-┊11┊  ┊    <!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
+┊  ┊ 8┊    <!-- compiled css output -->
 ┊12┊ 9┊    <link href="css/ionic.app.css" rel="stylesheet">
-┊13┊  ┊    -->
-┊14┊  ┊
-┊15┊  ┊    <!-- ionic/angularjs js -->
-┊16┊  ┊    <script src="lib/ionic/js/ionic.bundle.js"></script>
 ┊17┊10┊
 ┊18┊11┊    <!-- cordova script (this will be a 404 during development) -->
 ┊19┊12┊    <script src="cordova.js"></script>
 ┊20┊13┊
 ┊21┊14┊    <!-- your app's js -->
-┊22┊  ┊    <script src="js/app.js"></script>
-┊23┊  ┊    <script src="js/controllers.js"></script>
-┊24┊  ┊    <script src="js/services.js"></script>
+┊  ┊15┊    <script src="js/app.bundle.js"></script>
 ┊25┊16┊  </head>
-┊26┊  ┊  <body ng-app="starter">
+┊  ┊17┊
+┊  ┊18┊  <body>
 ┊27┊19┊    <!--
 ┊28┊20┊      The nav bar that will be updated as we navigate between views.
 ┊29┊21┊    -->
```
[}]: #

- We named our app `Whatsapp`, since that's what it represents.
- We removed all css files accept for one, since they are all pre-processed and imported using a library called [SASS](http://sass-lang.com/) into one file called `ionic.app.css`. All our scss files should be defined in `scss` folder.
- Same goes for javascript files, they will all be bundled into one file called `app.bundle.js` using our `Webpack` config we've just defined.
- We removed the `ng-app` attribute which will then take place in our javascript code.

Now that we have an initial setup, let's define our entry point for our code. Create a file called `index.js` in our `src` folder with the following contents:

[{]: <helper> (diff_step 1.6)
#### Step 1.6: Add index js file

##### Added src/index.js
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊// libs
+┊ ┊2┊import 'script!lib/angular/angular';
+┊ ┊3┊import 'script!lib/angular-animate/angular-animate';
+┊ ┊4┊import 'script!lib/angular-sanitize/angular-sanitize';
+┊ ┊5┊import 'script!lib/angular-ui-router/release/angular-ui-router';
+┊ ┊6┊import 'script!lib/ionic/js/ionic';
+┊ ┊7┊import 'script!lib/ionic/js/ionic-angular';
+┊ ┊8┊// app
+┊ ┊9┊import './app';🚫↵
```
[}]: #

This is simply a file where all our desired scripts are loaded. Note that libraries are being loaded with the `script!` pre-fix, which is braught to us by the `script-loader` npm package. This pre-fix is called a loader, and we actually have many types of it, but in this case it tells `Webpack` that the files specified afterwards should be loaded as-is, without handling any module requirements or any pre-processors.

> *NOTE*: We can also specify the script loader as a general rule for all our libraries, but this way it won't be clear that the files we just imported are being imported as scripts. Both approaches are good, but we will stick with the direct and simple approach of specifying the script loader for every library module imported, because it's more declerative.

As you can see there is also an `app.js` file being imported at the bottom. This file should be our main app file. Let's write it:

[{]: <helper> (diff_step 1.7)
#### Step 1.7: Add base app file

##### Added src/app.js
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊import Angular from 'angular';
+┊  ┊ 2┊import Ionic from 'ionic';
+┊  ┊ 3┊import Keyboard from 'cordova/keyboard';
+┊  ┊ 4┊import StatusBar from 'cordova/status-bar';
+┊  ┊ 5┊
+┊  ┊ 6┊const App = 'whatsapp';
+┊  ┊ 7┊
+┊  ┊ 8┊Angular.module(App, [
+┊  ┊ 9┊  'ionic'
+┊  ┊10┊]);
+┊  ┊11┊
+┊  ┊12┊Ionic.Platform.ready(() => {
+┊  ┊13┊  if (Keyboard) {
+┊  ┊14┊    Keyboard.hideKeyboardAccessoryBar(true);
+┊  ┊15┊    Keyboard.disableScroll(true);
+┊  ┊16┊  }
+┊  ┊17┊
+┊  ┊18┊  if (StatusBar) {
+┊  ┊19┊    StatusBar.styleLightContent();
+┊  ┊20┊  }
+┊  ┊21┊
+┊  ┊22┊  Angular.bootstrap(document, [App]);
+┊  ┊23┊});
```
[}]: #

As you can see, we define our app's module and we bootstrap it. Bootstraping is when we initialize primary logic in our application, and is done automatically by `Angular`. Ofcourse, there is some additional code related to `cordova` enviroment, like hiding the keyboard on startup.

We'de now like to build our app and watch for file changes as we run our app. To do so, just edit the `ionic.project` file and add `Gulp` files to run on startup.

[{]: <helper> (diff_step 1.8)
#### Step 1.8: Add gulp startup tasks to ionic.project

##### Changed ionic.project
```diff
@@ -1,4 +1,8 @@
 ┊1┊1┊{
 ┊2┊2┊  "name": "whatsapp",
-┊3┊ ┊  "app_id": ""
+┊ ┊3┊  "gulpStartupTasks": [
+┊ ┊4┊    "webpack",
+┊ ┊5┊    "sass",
+┊ ┊6┊    "watch"
+┊ ┊7┊  ]
 ┊4┊8┊}
```
[}]: #

Also, since we use pre-processors for both our `.js` and `.css` files, they are not relevant anymore. Let's make sure they won't be included in our next commits by adding them to the `.gitignore` file:

[{]: <helper> (diff_step 1.9)
#### Step 1.9: Add js and css dirs to .gitignore

##### Changed .gitignore
```diff
@@ -6,3 +6,5 @@
 ┊ 6┊ 6┊plugins/
 ┊ 7┊ 7┊.idea
 ┊ 8┊ 8┊www/lib/
+┊  ┊ 9┊www/css/
+┊  ┊10┊www/js/
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Intro](../../README.md) | [Next Step >](step2.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #