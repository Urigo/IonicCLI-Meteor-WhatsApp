[{]: <region> (header)
# Step 3: Creating a realtime Meteor server
[}]: #
[{]: <region> (body)
Now that we have the layout and some dummy data, let’s create a Meteor server and connect to it to make our app real.

First download Meteor from the Meteor site: [https://www.meteor.com/](https://www.meteor.com/)

Now let’s create a new Meteor server inside our project.

Open the command line in our app’s root folder and type:

    $ meteor create api

We just created a live and ready example Meteor app inside an `api` folder.

As you can see `Meteor` provides with an example app. Since non of it is relevant to us, you can go ahead and delete:

    $ cd api
    $ rm .gitignore
    $ rm package.json
    $ rm -rf node_modules
    $ rm -rf client
    $ rm -rf server

By now you probably noticed that `Meteor` uses `npm`, just like the our `Ionic` project. Since we don't want our client and server to be seperated and require a duplicated installation for each package we decide to add, we'll need to find a way to make them share the same resource.

We will acheive that by symbolic linking the `node_modules` dir:

    $ cd api
    $ ln -s ../node_modules

> *NOTE*: Our symbolic link needs to be relative, otherwise it won't work on other machines cloning the project.

Don't forget to reinstall `Meteor`'s node dependencies after we deleted the `node_modules` dir:

    $ npm install meteor-node-stubs babel-runtime --save

Our `package.json` should look like this:

[{]: <helper> (diff_step 3.3)
#### Step 3.3: Install api dependencies

##### Changed package.json
```diff
@@ -19,6 +19,7 @@
 ┊19┊19┊    "lodash.camelcase": "^4.1.1",
 ┊20┊20┊    "lodash.upperfirst": "^4.2.0",
 ┊21┊21┊    "script-loader": "^0.7.0",
+┊  ┊22┊    "meteor-node-stubs": "^0.2.3",
 ┊22┊23┊    "moment": "^2.13.0",
 ┊23┊24┊    "webpack": "^1.13.0"
 ┊24┊25┊  },
```
[}]: #

Now we are ready to write some server code.

Let’s define two data collections, one for our `Chats` and one for their `Messages`.

We will define them inside a dir called `server` in the `api`, since code written under this dir will be bundled only for server side by `Meteor`'s build system. We have no control of it and therefore we can't change this layout. This is one of `Meteor`'s disadvantages, that it's not configurable, so we will have to fit ourselves into this build strategy.

Let's go ahead and create the `collections.js` file:

[{]: <helper> (diff_step 3.4)
#### Step 3.4: Add messages and chats collections to api

##### Added api/server/collections.js
```diff
@@ -0,0 +1,4 @@
+┊ ┊1┊import { Mongo } from 'meteor/mongo';
+┊ ┊2┊
+┊ ┊3┊export const Chats = new Mongo.Collection('chats');
+┊ ┊4┊export const Messages = new Mongo.Collection('messages');🚫↵
```
[}]: #

Now we will update our `webpack.config.js` to handle some server logic:

[{]: <helper> (diff_step 3.5)
#### Step 3.5: Update webpack config to handle api code

##### Changed webpack.config.js
```diff
@@ -33,16 +33,28 @@
 ┊33┊33┊  resolve: {
 ┊34┊34┊    extensions: ['', '.js'],
 ┊35┊35┊    alias: {
-┊36┊  ┊      lib: __dirname + '/www/lib'
+┊  ┊36┊      lib: __dirname + '/www/lib',
+┊  ┊37┊      api: __dirname + '/api/server'
 ┊37┊38┊    }
 ┊38┊39┊  }
 ┊39┊40┊};
 ┊40┊41┊
 ┊41┊42┊function resolveExternals(context, request, callback) {
-┊42┊  ┊  return cordovaPlugin(request, callback) ||
+┊  ┊43┊  return meteorPack(request, callback) ||
+┊  ┊44┊         cordovaPlugin(request, callback) ||
 ┊43┊45┊         callback();
 ┊44┊46┊}
 ┊45┊47┊
+┊  ┊48┊function meteorPack(request, callback) {
+┊  ┊49┊  var match = request.match(/^meteor\/(.+)$/);
+┊  ┊50┊  var pack = match && match[1];
+┊  ┊51┊
+┊  ┊52┊  if (pack) {
+┊  ┊53┊    callback(null, 'Package["' + pack + '"]' );
+┊  ┊54┊    return true;
+┊  ┊55┊  }
+┊  ┊56┊}
+┊  ┊57┊
 ┊46┊58┊function cordovaPlugin(request, callback) {
 ┊47┊59┊  var match = request.match(/^cordova\/(.+)$/);
 ┊48┊60┊  var plugin = match && match[1];
```
[}]: #

We simply added an alias for the `api/server` folder and a custom handler for resolving `Meteor` packages. This gives us the effect of combining client side code with server side code, something that is already built-in in `Meteor`'s cli, only this time we created it.

Now that the server side is connected to the client side, we will also need to watch for changes over there and re-build our client code accordingly.

To do so, we will have to update the watched paths in the `gulpfile.js`:

[{]: <helper> (diff_step 3.6)
#### Step 3.6: Update watch paths in gulp file

##### Changed gulpfile.js
```diff
@@ -11,7 +11,7 @@
 ┊11┊11┊var webpackConfig = require('./webpack.config');
 ┊12┊12┊
 ┊13┊13┊var paths = {
-┊14┊  ┊  webpack: ['./src/**/*.js', '!./www/lib/**/*'],
+┊  ┊14┊  webpack: ['./src/**/*.js', '!./www/lib/**/*', './api/server/**/*.js'],
 ┊15┊15┊  sass: ['./scss/**/*.scss']
 ┊16┊16┊};
```
[}]: #

Let’s bring `Meteor`'s powerful client side tools that will help us easily sync to the `Meteor` server in real time.

Navigate the command line into your project’s root folder and type:

    $ npm install meteor-client-side --save
    $ npm install angular-meteor --save

Notice that we also installed `angular-meteor` package which will help us bring `Meteor`'s benefits into an `Angular` project.

Our `package.json` should look like so:

[{]: <helper> (diff_step 3.7)
#### Step 3.7: Install meteor client dependencies

##### Changed package.json
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊  "description": "whatsapp: An Ionic project",
 ┊ 5┊ 5┊  "dependencies": {
 ┊ 6┊ 6┊    "angular-ecmascript": "0.0.3",
+┊  ┊ 7┊    "angular-meteor": "^1.3.11",
 ┊ 7┊ 8┊    "babel": "^6.5.2",
 ┊ 8┊ 9┊    "babel-core": "^6.7.6",
 ┊ 9┊10┊    "babel-loader": "^6.2.4",
```
```diff
@@ -18,9 +19,10 @@
 ┊18┊19┊    "gulp-sass": "^2.0.4",
 ┊19┊20┊    "lodash.camelcase": "^4.1.1",
 ┊20┊21┊    "lodash.upperfirst": "^4.2.0",
-┊21┊  ┊    "script-loader": "^0.7.0",
+┊  ┊22┊    "meteor-client-side": "^1.3.4",
 ┊22┊23┊    "meteor-node-stubs": "^0.2.3",
 ┊23┊24┊    "moment": "^2.13.0",
+┊  ┊25┊    "script-loader": "^0.7.0",
 ┊24┊26┊    "webpack": "^1.13.0"
 ┊25┊27┊  },
 ┊26┊28┊  "devDependencies": {
```
[}]: #

Don't forget to import the packages we've just installed in the `index.js` file:

[{]: <helper> (diff_step 3.8)
#### Step 3.8: Import meteor client dependencies in index js

##### Changed src/index.js
```diff
@@ -7,5 +7,7 @@
 ┊ 7┊ 7┊import 'script!lib/angular-ui-router/release/angular-ui-router';
 ┊ 8┊ 8┊import 'script!lib/ionic/js/ionic';
 ┊ 9┊ 9┊import 'script!lib/ionic/js/ionic-angular';
+┊  ┊10┊import 'script!meteor-client-side/dist/meteor-client-side.bundle';
+┊  ┊11┊import 'script!angular-meteor/dist/angular-meteor.bundle';
 ┊10┊12┊// app
-┊11┊  ┊import './app';🚫↵
+┊  ┊13┊import './app';
```
[}]: #

We will also need to load `angular-meteor` into our app as a module dependency, since that's how `Angular`'s module system works:

[{]: <helper> (diff_step 3.9)
#### Step 3.9: Add angular-meteor to app dependencies

##### Changed src/app.js
```diff
@@ -11,6 +11,7 @@
 ┊11┊11┊const App = 'whatsapp';
 ┊12┊12┊
 ┊13┊13┊Angular.module(App, [
+┊  ┊14┊  'angular-meteor',
 ┊14┊15┊  'ionic'
 ┊15┊16┊]);
```
[}]: #

Now instead of mocking a static data in the controller, we can mock it in the server.

Create a file named `bootstrap.js` inside the `api/server` dir and place the following initialization code inside:

[{]: <helper> (diff_step 3.10)
#### Step 3.10: Mock initial data in chats and messages collections

##### Added api/server/bootstrap.js
```diff
@@ -0,0 +1,66 @@
+┊  ┊ 1┊import Moment from 'moment';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { Chats, Messages } from './collections';
+┊  ┊ 4┊
+┊  ┊ 5┊Meteor.startup(function() {
+┊  ┊ 6┊  if (Chats.find().count() !== 0) return;
+┊  ┊ 7┊
+┊  ┊ 8┊  Messages.remove({});
+┊  ┊ 9┊
+┊  ┊10┊  const messages = [
+┊  ┊11┊    {
+┊  ┊12┊      text: 'You on your way?',
+┊  ┊13┊      timestamp: Moment().subtract(1, 'hours').toDate()
+┊  ┊14┊    },
+┊  ┊15┊    {
+┊  ┊16┊      text: 'Hey, it\'s me',
+┊  ┊17┊      timestamp: Moment().subtract(2, 'hours').toDate()
+┊  ┊18┊    },
+┊  ┊19┊    {
+┊  ┊20┊      text: 'I should buy a boat',
+┊  ┊21┊      timestamp: Moment().subtract(1, 'days').toDate()
+┊  ┊22┊    },
+┊  ┊23┊    {
+┊  ┊24┊      text: 'Look at my mukluks!',
+┊  ┊25┊      timestamp: Moment().subtract(4, 'days').toDate()
+┊  ┊26┊    },
+┊  ┊27┊    {
+┊  ┊28┊      text: 'This is wicked good ice cream.',
+┊  ┊29┊      timestamp: Moment().subtract(2, 'weeks').toDate()
+┊  ┊30┊    }
+┊  ┊31┊  ];
+┊  ┊32┊
+┊  ┊33┊  messages.forEach((m) => {
+┊  ┊34┊    Messages.insert(m);
+┊  ┊35┊  });
+┊  ┊36┊
+┊  ┊37┊  const chats = [
+┊  ┊38┊    {
+┊  ┊39┊      name: 'Ethan Gonzalez',
+┊  ┊40┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
+┊  ┊41┊    },
+┊  ┊42┊    {
+┊  ┊43┊      name: 'Bryan Wallace',
+┊  ┊44┊      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
+┊  ┊45┊    },
+┊  ┊46┊    {
+┊  ┊47┊      name: 'Avery Stewart',
+┊  ┊48┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
+┊  ┊49┊    },
+┊  ┊50┊    {
+┊  ┊51┊      name: 'Katie Peterson',
+┊  ┊52┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
+┊  ┊53┊    },
+┊  ┊54┊    {
+┊  ┊55┊      name: 'Ray Edwards',
+┊  ┊56┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
+┊  ┊57┊    }
+┊  ┊58┊  ];
+┊  ┊59┊
+┊  ┊60┊  chats.forEach((chat) => {
+┊  ┊61┊    const message = Messages.findOne({ chatId: { $exists: false } });
+┊  ┊62┊    chat.lastMessage = message;
+┊  ┊63┊    const chatId = Chats.insert(chat);
+┊  ┊64┊    Messages.update(message._id, { $set: { chatId } });
+┊  ┊65┊  });
+┊  ┊66┊});🚫↵
```
[}]: #

The code is pretty easy and self explanatory.

Let’s bind the collections to our `ChatsCtrl`.

We will use `Scope.helpers()`, each key will be available on the template and will be updated when it changes. Read more about helpers in our [API](http://www.angular-meteor.com/api/helpers).

[{]: <helper> (diff_step 3.11)
#### Step 3.11: Fetch data from chats collection in chats controller

##### Changed src/controllers/chats.controller.js
```diff
@@ -1,61 +1,19 @@
-┊ 1┊  ┊import Moment from 'moment';
+┊  ┊ 1┊import { Chats } from 'api/collections';
 ┊ 2┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊ 3┊ 3┊
 ┊ 4┊ 4┊export default class ChatsCtrl extends Controller {
 ┊ 5┊ 5┊  constructor() {
 ┊ 6┊ 6┊    super(...arguments);
 ┊ 7┊ 7┊
-┊ 8┊  ┊    this.data = [
-┊ 9┊  ┊      {
-┊10┊  ┊        _id: 0,
-┊11┊  ┊        name: 'Ethan Gonzalez',
-┊12┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
-┊13┊  ┊        lastMessage: {
-┊14┊  ┊          text: 'You on your way?',
-┊15┊  ┊          timestamp: Moment().subtract(1, 'hours').toDate()
-┊16┊  ┊        }
-┊17┊  ┊      },
-┊18┊  ┊      {
-┊19┊  ┊        _id: 1,
-┊20┊  ┊        name: 'Bryan Wallace',
-┊21┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
-┊22┊  ┊        lastMessage: {
-┊23┊  ┊          text: 'Hey, it\'s me',
-┊24┊  ┊          timestamp: Moment().subtract(2, 'hours').toDate()
-┊25┊  ┊        }
-┊26┊  ┊      },
-┊27┊  ┊      {
-┊28┊  ┊        _id: 2,
-┊29┊  ┊        name: 'Avery Stewart',
-┊30┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
-┊31┊  ┊        lastMessage: {
-┊32┊  ┊          text: 'I should buy a boat',
-┊33┊  ┊          timestamp: Moment().subtract(1, 'days').toDate()
-┊34┊  ┊        }
-┊35┊  ┊      },
-┊36┊  ┊      {
-┊37┊  ┊        _id: 3,
-┊38┊  ┊        name: 'Katie Peterson',
-┊39┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
-┊40┊  ┊        lastMessage: {
-┊41┊  ┊          text: 'Look at my mukluks!',
-┊42┊  ┊          timestamp: Moment().subtract(4, 'days').toDate()
-┊43┊  ┊        }
-┊44┊  ┊      },
-┊45┊  ┊      {
-┊46┊  ┊        _id: 4,
-┊47┊  ┊        name: 'Ray Edwards',
-┊48┊  ┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
-┊49┊  ┊        lastMessage: {
-┊50┊  ┊          text: 'This is wicked good ice cream.',
-┊51┊  ┊          timestamp: Moment().subtract(2, 'weeks').toDate()
-┊52┊  ┊        }
+┊  ┊ 8┊    this.helpers({
+┊  ┊ 9┊      data() {
+┊  ┊10┊        return Chats.find();
 ┊53┊11┊      }
-┊54┊  ┊    ];
+┊  ┊12┊    });
 ┊55┊13┊  }
 ┊56┊14┊
 ┊57┊15┊  remove(chat) {
-┊58┊  ┊    this.data.splice(this.data.indexOf(chat), 1);
+┊  ┊16┊    this.data.remove(chat._id);
 ┊59┊17┊  }
 ┊60┊18┊}
```
[}]: #

> *NOTE*: These are exactly the same collections as the server's. Adding `meteor-client-side` to our project has created a `Minimongo` on our client side. `Minimongo` is a client side cache with exactly the same API as [Mongo](https://www.mongodb.org/)'s API. `Minimongo` will take care of syncing the data automatically with the server.

> *NOTE*: `meteor-client-side` will try to connect to `localhost:3000` by default. To change it, simply set a global object named `__meteor_runtime_config__` with a property called `DDP_DEFAULT_CONNECTION_URL` and set whatever server url you'd like to connect to.

> *TIP*: You can have a static separate front end app that works with a `Meteor` server. you can use `Meteor` as a back end server to any front end app without changing anything in your app structure or build process.

Now our app with all its clients is synced with our server in real time!

To test it, you can open another browser, or another window in incognito mode, open another client side by side and delete a chat (by swiping the chat to the left and clicking `delete`).

See the chat is being deleted and updated in all the connected client in real time!



[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step2.md) | [Next Step >](step4.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #