[{]: <region> (header)
# Step 2: Layout, coding style & structure
[}]: #
[{]: <region> (body)
Now that we've finished making our initial setup, let's dive into the code of our app.

First, we will need some helpers which will help us write some `AngularJS` code using es6's class system. For this purpose we will use [angular-ecmascript](https://github.com/DAB0mB/angular-ecmascript) npm package. Let's install it:

    $ npm install angular-ecmascript --save

`angular-ecmascript` is a utility library which will help us write an `AngularJS` app using es6's class system. In addition, `angular-ecmascript` provides us with some very handy features, like auto-injection without using any pre-processors like [ng-annotate](https://github.com/olov/ng-annotate), or setting our controller as the view model any time it is created (See [referene](/api/1.3.11/reactive)). The API shouldn't be too complicated to understand, and we will get familiar with it as we make progress with this tutorial.

> *NOTE*: As for now there is no best pratice for writing `AngularJS` es6 code, this is one method we recommend out of many possible other options.

Now that everything is set, let's create the `RoutesConfig` using the `Config` module-helper:

[{]: <helper> (diff_step 2.2)
#### Step 2.2: Add initial routes config

##### Added src/routes.js
```diff
@@ -0,0 +1,14 @@
+┊  ┊ 1┊import { Config } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊
+┊  ┊ 3┊export default class RoutesConfig extends Config {
+┊  ┊ 4┊  static $inject = ['$stateProvider']
+┊  ┊ 5┊
+┊  ┊ 6┊  configure() {
+┊  ┊ 7┊    this.$stateProvider
+┊  ┊ 8┊      .state('tab', {
+┊  ┊ 9┊        url: '/tab',
+┊  ┊10┊        abstract: true,
+┊  ┊11┊        templateUrl: 'templates/tabs.html'
+┊  ┊12┊      });
+┊  ┊13┊  }
+┊  ┊14┊}🚫↵
```
[}]: #

This will be our main app router which is implemented using [angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router), and anytime we would like to add some new routes and configure them, this is where we do so.

After we define a helper, we shall always load it in the main app file. Let's do so:

[{]: <helper> (diff_step 2.3)
#### Step 2.3: Load routes

##### Changed src/app.js
```diff
@@ -2,6 +2,9 @@
 ┊ 2┊ 2┊import Ionic from 'ionic';
 ┊ 3┊ 3┊import Keyboard from 'cordova/keyboard';
 ┊ 4┊ 4┊import StatusBar from 'cordova/status-bar';
+┊  ┊ 5┊import Loader from 'angular-ecmascript/module-loader';
+┊  ┊ 6┊
+┊  ┊ 7┊import RoutesConfig from './routes';
 ┊ 5┊ 8┊
 ┊ 6┊ 9┊const App = 'whatsapp';
 ┊ 7┊10┊
```
```diff
@@ -9,6 +12,9 @@
 ┊ 9┊12┊  'ionic'
 ┊10┊13┊]);
 ┊11┊14┊
+┊  ┊15┊new Loader(App)
+┊  ┊16┊  .load(RoutesConfig);
+┊  ┊17┊
 ┊12┊18┊Ionic.Platform.ready(() => {
 ┊13┊19┊  if (Keyboard) {
 ┊14┊20┊    Keyboard.hideKeyboardAccessoryBar(true);
```
[}]: #

As you can see there is only one route state defined as for now, called `tabs`, which is connected to the `tabs` view. Let's add it:

[{]: <helper> (diff_step 2.4)
#### Step 2.4: Add tabs view

##### Added www/templates/tabs.html
```diff
@@ -0,0 +1,21 @@
+┊  ┊ 1┊<ion-tabs class="tabs-stable tabs-icon-top tabs-color-positive" ng-cloak>
+┊  ┊ 2┊  <ion-tab title="Favorites" icon-on="ion-ios-star" icon-off="ion-ios-star-outline" href="#/tab/favorites">
+┊  ┊ 3┊    <ion-nav-view name="tab-favorites"></ion-nav-view>
+┊  ┊ 4┊  </ion-tab>
+┊  ┊ 5┊
+┊  ┊ 6┊  <ion-tab title="Recents" icon-on="ion-ios-clock" icon-off="ion-ios-clock-outline" href="#/tab/recents">
+┊  ┊ 7┊    <ion-nav-view name="tab-recents"></ion-nav-view>
+┊  ┊ 8┊  </ion-tab>
+┊  ┊ 9┊
+┊  ┊10┊  <ion-tab title="Contacts" icon-on="ion-ios-person" icon-off="ion-ios-person-outline" href="#/tab/contacts">
+┊  ┊11┊    <ion-nav-view name="tab-contacts"></ion-nav-view>
+┊  ┊12┊  </ion-tab>
+┊  ┊13┊
+┊  ┊14┊  <ion-tab title="Chats" icon-on="ion-ios-chatbubble" icon-off="ion-ios-chatbubble-outline" href="#/tab/chats">
+┊  ┊15┊    <ion-nav-view name="tab-chats"></ion-nav-view>
+┊  ┊16┊  </ion-tab>
+┊  ┊17┊
+┊  ┊18┊  <ion-tab title="Settings" icon-on="ion-ios-cog" icon-off="ion-ios-cog-outline" href="#/tab/settings">
+┊  ┊19┊    <ion-nav-view name="tab-settings"></ion-nav-view>
+┊  ┊20┊  </ion-tab>
+┊  ┊21┊</ion-tabs>🚫↵
```
[}]: #

In our app we will have 5 tabs: `Favorites`, `Recents`, `Contacts`, `Chats`, and `Settings`. In this tutorial we will only focus on implementing the `Chats` and the `Settings` tabs, but your'e more than free to continue on with this tutorial and implement the rest of the tabs.

Let's create `Chats` view which will appear one we click on the `Chats` tab. But first, let's install an npm package called `Moment` which is a utility library for manipulating date object. It will soon come in handy:

    $ npm install moment --save

Our `package.json` should look like so:

[{]: <helper> (diff_step 2.5)
#### Step 2.5: Install moment npm package

##### Changed package.json
```diff
@@ -19,6 +19,7 @@
 ┊19┊19┊    "lodash.camelcase": "^4.1.1",
 ┊20┊20┊    "lodash.upperfirst": "^4.2.0",
 ┊21┊21┊    "script-loader": "^0.7.0",
+┊  ┊22┊    "moment": "^2.13.0",
 ┊22┊23┊    "webpack": "^1.13.0"
 ┊23┊24┊  },
 ┊24┊25┊  "devDependencies": {
```
[}]: #

Now that we have installed `Moment`, we need to expose it to our environment, since some libraries we load which are not using es6's module system rely on it being defined as a global variable. For these purposes we shall use the `expose-loader`. Simply, add to our `index.js` file:

[{]: <helper> (diff_step 2.6)
#### Step 2.6: Import and expose moment in index js

##### Changed src/index.js
```diff
@@ -1,3 +1,5 @@
+┊ ┊1┊// modules
+┊ ┊2┊import 'expose?moment!moment';
 ┊1┊3┊// libs
 ┊2┊4┊import 'script!lib/angular/angular';
 ┊3┊5┊import 'script!lib/angular-animate/angular-animate';
```
[}]: #

After the `?` comes the variable name which shuold be defined on the global scope, and after the `!` comes the library we would like to load. In this case we load the `Moment` library and we would like to expose it as `window.global`.

> *NOTE*: Altough `Moment` is defined on the global scope, we will keep importing it in every module we wanna use it, since it's more declerative and clearer.

Now that we have `Moment` lock and loaded, we will create our `Chats` controller and we will use it to create some data stubs:

[{]: <helper> (diff_step 2.7)
#### Step 2.7: Add chats controller with data stubs

##### Added src/controllers/chats.controller.js
```diff
@@ -0,0 +1,58 @@
+┊  ┊ 1┊import Moment from 'moment';
+┊  ┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class ChatsCtrl extends Controller {
+┊  ┊ 5┊  constructor() {
+┊  ┊ 6┊    super(...arguments);
+┊  ┊ 7┊
+┊  ┊ 8┊    this.data = [
+┊  ┊ 9┊      {
+┊  ┊10┊        _id: 0,
+┊  ┊11┊        name: 'Ethan Gonzalez',
+┊  ┊12┊        picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
+┊  ┊13┊        lastMessage: {
+┊  ┊14┊          text: 'You on your way?',
+┊  ┊15┊          timestamp: Moment().subtract(1, 'hours').toDate()
+┊  ┊16┊        }
+┊  ┊17┊      },
+┊  ┊18┊      {
+┊  ┊19┊        _id: 1,
+┊  ┊20┊        name: 'Bryan Wallace',
+┊  ┊21┊        picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg',
+┊  ┊22┊        lastMessage: {
+┊  ┊23┊          text: 'Hey, it\'s me',
+┊  ┊24┊          timestamp: Moment().subtract(2, 'hours').toDate()
+┊  ┊25┊        }
+┊  ┊26┊      },
+┊  ┊27┊      {
+┊  ┊28┊        _id: 2,
+┊  ┊29┊        name: 'Avery Stewart',
+┊  ┊30┊        picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
+┊  ┊31┊        lastMessage: {
+┊  ┊32┊          text: 'I should buy a boat',
+┊  ┊33┊          timestamp: Moment().subtract(1, 'days').toDate()
+┊  ┊34┊        }
+┊  ┊35┊      },
+┊  ┊36┊      {
+┊  ┊37┊        _id: 3,
+┊  ┊38┊        name: 'Katie Peterson',
+┊  ┊39┊        picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
+┊  ┊40┊        lastMessage: {
+┊  ┊41┊          text: 'Look at my mukluks!',
+┊  ┊42┊          timestamp: Moment().subtract(4, 'days').toDate()
+┊  ┊43┊        }
+┊  ┊44┊      },
+┊  ┊45┊      {
+┊  ┊46┊        _id: 4,
+┊  ┊47┊        name: 'Ray Edwards',
+┊  ┊48┊        picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
+┊  ┊49┊        lastMessage: {
+┊  ┊50┊          text: 'This is wicked good ice cream.',
+┊  ┊51┊          timestamp: Moment().subtract(2, 'weeks').toDate()
+┊  ┊52┊        }
+┊  ┊53┊      }
+┊  ┊54┊    ];
+┊  ┊55┊  }
+┊  ┊56┊}
+┊  ┊57┊
+┊  ┊58┊ChatsCtrl.$name = 'ChatsCtrl';🚫↵
```
[}]: #

And we will load it:

[{]: <helper> (diff_step 2.8)
#### Step 2.8: Load chats controller

##### Changed src/app.js
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import StatusBar from 'cordova/status-bar';
 ┊ 5┊ 5┊import Loader from 'angular-ecmascript/module-loader';
 ┊ 6┊ 6┊
+┊  ┊ 7┊import ChatsCtrl from './controllers/chats.controller';
 ┊ 7┊ 8┊import RoutesConfig from './routes';
 ┊ 8┊ 9┊
 ┊ 9┊10┊const App = 'whatsapp';
```
```diff
@@ -13,6 +14,7 @@
 ┊13┊14┊]);
 ┊14┊15┊
 ┊15┊16┊new Loader(App)
+┊  ┊17┊  .load(ChatsCtrl)
 ┊16┊18┊  .load(RoutesConfig);
 ┊17┊19┊
 ┊18┊20┊Ionic.Platform.ready(() => {
```
[}]: #

> *NOTE*: From now on any component we create we will also load it right after, without any further explenations.

The data stubs are just a temporary fabricated data which will be used to test our application and how it reacts with it. You can also look at our scheme and figure out how our application is gonna look like.

Now that we have the controller with the data, we need a view to present it. We will use `ion-list` and `ion-item` directives, which provides us a list layout, and we will iterate our static data using `ng-repeat` and we will display the chat's name, image and timestamp.

Let's create it:

[{]: <helper> (diff_step 2.9)
#### Step 2.9: Add chats view

##### Added www/templates/chats.html
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊<ion-view view-title="Chats">
+┊  ┊ 2┊  <ion-content>
+┊  ┊ 3┊    <ion-list>
+┊  ┊ 4┊      <ion-item ng-repeat="chat in chats.data | orderBy:'-lastMessage.timestamp'"
+┊  ┊ 5┊                class="item-chat item-remove-animate item-avatar item-icon-right"
+┊  ┊ 6┊                type="item-text-wrap">
+┊  ┊ 7┊        <img ng-src="{{ chat.picture }}">
+┊  ┊ 8┊        <h2>{{ chat.name }}</h2>
+┊  ┊ 9┊        <p>{{ chat.lastMessage.text }}</p>
+┊  ┊10┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp }}</span>
+┊  ┊11┊        <i class="icon ion-chevron-right icon-accessory"></i>
+┊  ┊12┊      </ion-item>
+┊  ┊13┊    </ion-list>
+┊  ┊14┊  </ion-content>
+┊  ┊15┊</ion-view>🚫↵
```
[}]: #

We also need to define the appropriate route state which will be navigated any time we press the `Chats` tab. Let's do so:

[{]: <helper> (diff_step 2.10)
#### Step 2.10: Add chats route state

##### Changed src/routes.js
```diff
@@ -1,7 +1,7 @@
 ┊1┊1┊import { Config } from 'angular-ecmascript/module-helpers';
 ┊2┊2┊
 ┊3┊3┊export default class RoutesConfig extends Config {
-┊4┊ ┊  static $inject = ['$stateProvider']
+┊ ┊4┊  static $inject = ['$stateProvider', '$urlRouterProvider']
 ┊5┊5┊
 ┊6┊6┊  configure() {
 ┊7┊7┊    this.$stateProvider
```
```diff
@@ -9,6 +9,17 @@
 ┊ 9┊ 9┊        url: '/tab',
 ┊10┊10┊        abstract: true,
 ┊11┊11┊        templateUrl: 'templates/tabs.html'
+┊  ┊12┊      })
+┊  ┊13┊      .state('tab.chats', {
+┊  ┊14┊        url: '/chats',
+┊  ┊15┊        views: {
+┊  ┊16┊          'tab-chats': {
+┊  ┊17┊            templateUrl: 'templates/chats.html',
+┊  ┊18┊            controller: 'ChatsCtrl as chats'
+┊  ┊19┊          }
+┊  ┊20┊        }
 ┊12┊21┊      });
+┊  ┊22┊
+┊  ┊23┊    this.$urlRouterProvider.otherwise('tab/chats');
 ┊13┊24┊  }
 ┊14┊25┊}🚫↵
```
[}]: #

If you look closely we used the `controllerAs` syntax, which means that our data models should be stored on the controller and not on the scope.

We also used the `$urlRouterProvider.otherwise()` which defines our `Chats` state as the default one, so any unrecognized route state we navigate to our router will automatically redirect us to this state.

As for now, our chats' dates are presented in a very messy format which is not very informative for the every-day user. We wanna present it in a calendar format. Inorder to do that we need to define a `Filter`, which is provided by `Angular` and responsibe for projecting our data presented in the view. Let's add the `CalendarFilter`:

[{]: <helper> (diff_step 2.11)
#### Step 2.11: Add calendar filter

##### Added src/filters/calendar.filter.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import Moment from 'moment';
+┊  ┊ 2┊import { Filter } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class CalendarFilter extends Filter {
+┊  ┊ 5┊  static $name = 'calendar'
+┊  ┊ 6┊
+┊  ┊ 7┊  filter(time) {
+┊  ┊ 8┊    if (!time) return;
+┊  ┊ 9┊
+┊  ┊10┊    return Moment(time).calendar(null, {
+┊  ┊11┊      lastDay : '[Yesterday]',
+┊  ┊12┊      sameDay : 'LT',
+┊  ┊13┊      lastWeek : 'dddd',
+┊  ┊14┊      sameElse : 'DD/MM/YY'
+┊  ┊15┊    });
+┊  ┊16┊  }
+┊  ┊17┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 2.12)
#### Step 2.12: Load calendar filter

##### Changed src/app.js
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊import Loader from 'angular-ecmascript/module-loader';
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import ChatsCtrl from './controllers/chats.controller';
+┊  ┊ 8┊import CalendarFilter from './filters/calendar.filter';
 ┊ 8┊ 9┊import RoutesConfig from './routes';
 ┊ 9┊10┊
 ┊10┊11┊const App = 'whatsapp';
```
```diff
@@ -15,6 +16,7 @@
 ┊15┊16┊
 ┊16┊17┊new Loader(App)
 ┊17┊18┊  .load(ChatsCtrl)
+┊  ┊19┊  .load(CalendarFilter)
 ┊18┊20┊  .load(RoutesConfig);
 ┊19┊21┊
 ┊20┊22┊Ionic.Platform.ready(() => {
```
[}]: #

And now let's apply it to the view:

[{]: <helper> (diff_step 2.13)
#### Step 2.13: Apply calendar filter in chats view

##### Changed www/templates/chats.html
```diff
@@ -7,7 +7,7 @@
 ┊ 7┊ 7┊        <img ng-src="{{ chat.picture }}">
 ┊ 8┊ 8┊        <h2>{{ chat.name }}</h2>
 ┊ 9┊ 9┊        <p>{{ chat.lastMessage.text }}</p>
-┊10┊  ┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp }}</span>
+┊  ┊10┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp | calendar }}</span>
 ┊11┊11┊        <i class="icon ion-chevron-right icon-accessory"></i>
 ┊12┊12┊      </ion-item>
 ┊13┊13┊    </ion-list>
```
[}]: #

As you can see, inorder to apply a filter in the view we simply pipe it next to our data model.

We would also like to be able to remove a chat, let's add a delete button for each chat:

[{]: <helper> (diff_step 2.14)
#### Step 2.14: Add delete button to chats view

##### Changed www/templates/chats.html
```diff
@@ -9,6 +9,9 @@
 ┊ 9┊ 9┊        <p>{{ chat.lastMessage.text }}</p>
 ┊10┊10┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp | calendar }}</span>
 ┊11┊11┊        <i class="icon ion-chevron-right icon-accessory"></i>
+┊  ┊12┊        <ion-option-button class="button-assertive" ng-click="chats.remove(chat)">
+┊  ┊13┊          Delete
+┊  ┊14┊        </ion-option-button>
 ┊12┊15┊      </ion-item>
 ┊13┊16┊    </ion-list>
 ┊14┊17┊  </ion-content>
```
[}]: #

And implement its logic in the controller:

[{]: <helper> (diff_step 2.15)
#### Step 2.15: Implement chat removal logic in chats controller

##### Changed src/controllers/chats.controller.js
```diff
@@ -53,6 +53,10 @@
 ┊53┊53┊      }
 ┊54┊54┊    ];
 ┊55┊55┊  }
+┊  ┊56┊
+┊  ┊57┊  remove(chat) {
+┊  ┊58┊    this.data.splice(this.data.indexOf(chat), 1);
+┊  ┊59┊  }
 ┊56┊60┊}
 ┊57┊61┊
-┊58┊  ┊ChatsCtrl.$name = 'ChatsCtrl';🚫↵
+┊  ┊62┊ChatsCtrl.$name = 'ChatsCtrl';
```
[}]: #

Now everything is ready, but it looks a bit dull. Let's add some style to it:

[{]: <helper> (diff_step 2.16)
#### Step 2.16: Add chats stylesheet

##### Added scss/chats.scss
```diff
@@ -0,0 +1,9 @@
+┊ ┊1┊.item-chat {
+┊ ┊2┊  .last-message-timestamp {
+┊ ┊3┊    position: absolute;
+┊ ┊4┊    top: 16px;
+┊ ┊5┊    right: 38px;
+┊ ┊6┊    font-size: 14px;
+┊ ┊7┊    color: #9A9898;
+┊ ┊8┊  }
+┊ ┊9┊}🚫↵
```
[}]: #

Since the stylesheet was written in `SASS`, we need to import it into our main `scss` file:

[{]: <helper> (diff_step 2.17)
#### Step 2.17: Import chats stylesheet

##### Changed scss/ionic.app.scss
```diff
@@ -21,3 +21,4 @@
 ┊21┊21┊// Include all of Ionic
 ┊22┊22┊@import "www/lib/ionic/scss/ionic";
 ┊23┊23┊
+┊  ┊24┊@import "chats";
```
[}]: #

> *NOTE*: From now on every `scss` file we write will be imported right after without any further explenations.

Our `Chats` tab is now ready. You can run it inside a browser, or if you prefer to see it in a mobile layout, you should use `Ionic`'s simulator. Just follow the following instructions:

    $ npm install -g ios-sim
    $ cordova platform add i The API shouldn't be too complicated to understand, and we will get familiar with it as we make progress with this tutorial.



And if you swipe a menu item to the left:



[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step1.md) | [Next Step >](step3.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #