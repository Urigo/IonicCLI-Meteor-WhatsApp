[{]: <region> (header)
# Step 4: Chat view and send messages
[}]: #
[{]: <region> (body)
In this step we will add the chat view and the ability to send messages.

We still don’t have an identity for each user, we will add it later, but we can still send messages to existing chats.

So just like any other page, let’s begin by adding a very basic view with the chat's details:

[{]: <helper> (diff_step 4.1)
#### Step 4.1: Add chat view

##### Added www/templates/chat.html
```diff
@@ -0,0 +1,5 @@
+┊ ┊1┊<ion-view title="{{ chat.data.name }}">
+┊ ┊2┊  <ion-nav-buttons side="right">
+┊ ┊3┊    <button class="button button-clear"><img class="header-picture" ng-src="{{ chat.data.picture }}"></button>
+┊ ┊4┊  </ion-nav-buttons>
+┊ ┊5┊</ion-view>🚫↵
```
[}]: #

Now we need to implement the logic in the controller, so let’s create it:

[{]: <helper> (diff_step 4.2)
#### Step 4.2: Add chat controller

##### Added src/controllers/chat.controller.js
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊import { Chats } from 'api/collections';
+┊  ┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class ChatCtrl extends Controller {
+┊  ┊ 5┊  static $inject = ['$stateParams']
+┊  ┊ 6┊
+┊  ┊ 7┊  constructor() {
+┊  ┊ 8┊    super(...arguments);
+┊  ┊ 9┊
+┊  ┊10┊    this.chatId = this.$stateParams.chatId;
+┊  ┊11┊
+┊  ┊12┊    this.helpers({
+┊  ┊13┊      data() {
+┊  ┊14┊        return Chats.findOne(this.chatId);
+┊  ┊15┊      }
+┊  ┊16┊    });
+┊  ┊17┊  }
+┊  ┊18┊}
+┊  ┊19┊
+┊  ┊20┊ChatCtrl.$name = 'ChatCtrl';🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.3)
#### Step 4.3: Load chat controller

##### Changed src/app.js
```diff
@@ -4,6 +4,7 @@
 ┊ 4┊ 4┊import StatusBar from 'cordova/status-bar';
 ┊ 5┊ 5┊import Loader from 'angular-ecmascript/module-loader';
 ┊ 6┊ 6┊
+┊  ┊ 7┊import ChatCtrl from './controllers/chat.controller';
 ┊ 7┊ 8┊import ChatsCtrl from './controllers/chats.controller';
 ┊ 8┊ 9┊import CalendarFilter from './filters/calendar.filter';
 ┊ 9┊10┊import RoutesConfig from './routes';
```
```diff
@@ -16,6 +17,7 @@
 ┊16┊17┊]);
 ┊17┊18┊
 ┊18┊19┊new Loader(App)
+┊  ┊20┊  .load(ChatCtrl)
 ┊19┊21┊  .load(ChatsCtrl)
 ┊20┊22┊  .load(CalendarFilter)
 ┊21┊23┊  .load(RoutesConfig);
```
[}]: #

We used the `$statePrams` provider to get the id of the chat, and then we used the `Chats` collection to find the data related to the it. The function `findOne()` takes a query as a parameter and returns a single document. Just like collections in `MongoDB`.

Now that we have the view and the controller let's connect them by adding the appropriate route state:

[{]: <helper> (diff_step 4.4)
#### Step 4.4: Add chat route state

##### Changed src/routes.js
```diff
@@ -18,6 +18,15 @@
 ┊18┊18┊            controller: 'ChatsCtrl as chats'
 ┊19┊19┊          }
 ┊20┊20┊        }
+┊  ┊21┊      })
+┊  ┊22┊      .state('tab.chat', {
+┊  ┊23┊        url: '/chats/:chatId',
+┊  ┊24┊        views: {
+┊  ┊25┊          'tab-chats': {
+┊  ┊26┊            templateUrl: 'templates/chat.html',
+┊  ┊27┊            controller: 'ChatCtrl as chat'
+┊  ┊28┊          }
+┊  ┊29┊        }
 ┊21┊30┊      });
 ┊22┊31┊
 ┊23┊32┊    this.$urlRouterProvider.otherwise('tab/chats');
```
[}]: #

And all is left to do is to link these two:

[{]: <helper> (diff_step 4.5)
#### Step 4.5: Add chat reference to chats view

##### Changed www/templates/chats.html
```diff
@@ -3,7 +3,8 @@
 ┊ 3┊ 3┊    <ion-list>
 ┊ 4┊ 4┊      <ion-item ng-repeat="chat in chats.data | orderBy:'-lastMessage.timestamp'"
 ┊ 5┊ 5┊                class="item-chat item-remove-animate item-avatar item-icon-right"
-┊ 6┊  ┊                type="item-text-wrap">
+┊  ┊ 6┊                type="item-text-wrap"
+┊  ┊ 7┊                href="#/tab/chats/{{ chat._id }}">
 ┊ 7┊ 8┊        <img ng-src="{{ chat.picture }}">
 ┊ 8┊ 9┊        <h2>{{ chat.name }}</h2>
 ┊ 9┊10┊        <p>{{ chat.lastMessage.text }}</p>
```
[}]: #

Now each time we will click on a chat item from the menu, we should be navigating to it.

Let’s create a new `scss` file to our `Chat` and fix the image style so it won't look silly:

[{]: <helper> (diff_step 4.6)
#### Step 4.6: Add chat stylesheet

##### Added scss/chat.scss
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊.header-picture {
+┊ ┊2┊  max-width: 33px;
+┊ ┊3┊  max-height: 33px;
+┊ ┊4┊  width: 100%;
+┊ ┊5┊  height: 100%;
+┊ ┊6┊  border-radius: 50%;
+┊ ┊7┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.7)
#### Step 4.7: Import chat stylesheet

##### Changed scss/ionic.app.scss
```diff
@@ -21,4 +21,5 @@
 ┊21┊21┊// Include all of Ionic
 ┊22┊22┊@import "www/lib/ionic/scss/ionic";
 ┊23┊23┊
+┊  ┊24┊@import "chat";
 ┊24┊25┊@import "chats";
```
[}]: #

Our next step is about getting the chat messages on the controller, we will add another helper, but instead of using the whole collection we will fetch only the relevant messages for the current chat:

[{]: <helper> (diff_step 4.8)
#### Step 4.8: Add messages helper to chat controller

##### Changed src/controllers/chat.controller.js
```diff
@@ -1,4 +1,4 @@
-┊1┊ ┊import { Chats } from 'api/collections';
+┊ ┊1┊import { Chats, Messages } from 'api/collections';
 ┊2┊2┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊3┊3┊
 ┊4┊4┊export default class ChatCtrl extends Controller {
```
```diff
@@ -10,6 +10,9 @@
 ┊10┊10┊    this.chatId = this.$stateParams.chatId;
 ┊11┊11┊
 ┊12┊12┊    this.helpers({
+┊  ┊13┊      messages() {
+┊  ┊14┊        return Messages.find({ chatId: this.chatId });
+┊  ┊15┊      },
 ┊13┊16┊      data() {
 ┊14┊17┊        return Chats.findOne(this.chatId);
 ┊15┊18┊      }
```
[}]: #

And now to add it to the view, we use `ng-repeat` to iterate the messages:

[{]: <helper> (diff_step 4.9)
#### Step 4.9: Add messages to chat view

##### Changed www/templates/chat.html
```diff
@@ -2,4 +2,15 @@
 ┊ 2┊ 2┊  <ion-nav-buttons side="right">
 ┊ 3┊ 3┊    <button class="button button-clear"><img class="header-picture" ng-src="{{ chat.data.picture }}"></button>
 ┊ 4┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊
+┊  ┊ 6┊  <ion-content class="chat" delegate-handle="chatScroll">
+┊  ┊ 7┊    <div class="message-list">
+┊  ┊ 8┊      <div ng-repeat="message in chat.messages" class="message-wrapper">
+┊  ┊ 9┊        <div class="message" ng-class-even="'message-mine'" ng-class-odd="'message-other'">
+┊  ┊10┊          <div class="message-text">{{ message.text }}</div>
+┊  ┊11┊          <span class="message-timestamp">{{ message.timestamp }}</span>
+┊  ┊12┊        </div>
+┊  ┊13┊      </div>
+┊  ┊14┊    </div>
+┊  ┊15┊  </ion-content>
 ┊ 5┊16┊</ion-view>🚫↵
```
[}]: #

Now that it is well functioning, let's polish our `Chats`'s looking by adding some style to our newly created messages:

[{]: <helper> (diff_step 4.10)
#### Step 4.10: Add message style to chat stylesheet

##### Changed scss/chat.scss
```diff
@@ -4,4 +4,83 @@
 ┊ 4┊ 4┊  width: 100%;
 ┊ 5┊ 5┊  height: 100%;
 ┊ 6┊ 6┊  border-radius: 50%;
+┊  ┊ 7┊}
+┊  ┊ 8┊
+┊  ┊ 9┊.chat {
+┊  ┊10┊  background-image: url(/img/chat-background.jpg);
+┊  ┊11┊  background-color: #E0DAD6;
+┊  ┊12┊  background-repeat: no-repeat;
+┊  ┊13┊  background-size: 100%;
+┊  ┊14┊}
+┊  ┊15┊
+┊  ┊16┊.message-list {
+┊  ┊17┊  margin-top: 12px;
+┊  ┊18┊  padding: 0 5%;
+┊  ┊19┊}
+┊  ┊20┊
+┊  ┊21┊.message-wrapper {
+┊  ┊22┊  margin-bottom: 9px;
+┊  ┊23┊
+┊  ┊24┊  &::after {
+┊  ┊25┊    content: "";
+┊  ┊26┊    display: table;
+┊  ┊27┊    clear: both;
+┊  ┊28┊  }
+┊  ┊29┊}
+┊  ┊30┊
+┊  ┊31┊.message {
+┊  ┊32┊  display: inline-block;
+┊  ┊33┊  position: relative;
+┊  ┊34┊  max-width: 236px;
+┊  ┊35┊  border-radius: 7px;
+┊  ┊36┊  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
+┊  ┊37┊
+┊  ┊38┊  &.message-mine {
+┊  ┊39┊    float: right;
+┊  ┊40┊    background-color: #DCF8C6;
+┊  ┊41┊  }
+┊  ┊42┊
+┊  ┊43┊  &.message-other {
+┊  ┊44┊    float: left;
+┊  ┊45┊    background-color: #FFF;
+┊  ┊46┊  }
+┊  ┊47┊
+┊  ┊48┊  &.message-other::before, &.message-mine::before, {
+┊  ┊49┊    content: "";
+┊  ┊50┊    position: absolute;
+┊  ┊51┊    bottom: 3px;
+┊  ┊52┊    width: 12px;
+┊  ┊53┊    height: 19px;
+┊  ┊54┊    background-position: 50% 50%;
+┊  ┊55┊    background-repeat: no-repeat;
+┊  ┊56┊    background-size: contain;
+┊  ┊57┊  }
+┊  ┊58┊
+┊  ┊59┊  &.message-other::before {
+┊  ┊60┊    left: -11px;
+┊  ┊61┊    background-image: url(/img/message-other.png)
+┊  ┊62┊  }
+┊  ┊63┊
+┊  ┊64┊  &.message-mine::before {
+┊  ┊65┊    right: -11px;
+┊  ┊66┊    background-image: url(/img/message-mine.png)
+┊  ┊67┊  }
+┊  ┊68┊
+┊  ┊69┊  .message-text {
+┊  ┊70┊    padding: 5px 7px;
+┊  ┊71┊    word-wrap: break-word;
+┊  ┊72┊
+┊  ┊73┊    &::after {
+┊  ┊74┊      content: " \00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0";
+┊  ┊75┊      display: inline;
+┊  ┊76┊    }
+┊  ┊77┊  }
+┊  ┊78┊
+┊  ┊79┊  .message-timestamp {
+┊  ┊80┊    position: absolute;
+┊  ┊81┊    bottom: 2px;
+┊  ┊82┊    right: 7px;
+┊  ┊83┊    color: gray;
+┊  ┊84┊    font-size: 12px;
+┊  ┊85┊  }
 ┊ 7┊86┊}🚫↵
```
[}]: #

Also, this stylesheet uses some assets located in the `www/img` dir, so inorder for the stylesheet to work properly you'll need to copy the files located [here](https://github.com/Urigo/IonicCLI-Meteor-WhatsApp/tree/master/www/img).

After doing so, our app should look like this:



Now we just need to take care of the message timestamp and format it.

We will use `Moment` like before, but now let's add another package called [angular-moment](https://github.com/urish/angular-moment) that provides us the UI filters.

So adding the package is just like any other package we added so far. First, we will install it:

    $ npm install angular-moment --save

[{]: <helper> (diff_step 4.12)
#### Step 4.12: Install angular-moment npm package

##### Changed package.json
```diff
@@ -5,6 +5,7 @@
 ┊ 5┊ 5┊  "dependencies": {
 ┊ 6┊ 6┊    "angular-ecmascript": "0.0.3",
 ┊ 7┊ 7┊    "angular-meteor": "^1.3.11",
+┊  ┊ 8┊    "angular-moment": "^1.0.0",
 ┊ 8┊ 9┊    "babel": "^6.5.2",
 ┊ 9┊10┊    "babel-core": "^6.7.6",
 ┊10┊11┊    "babel-loader": "^6.2.4",
```
[}]: #

And then we will load it:

[{]: <helper> (diff_step 4.13)
#### Step 4.13: Import angular-moment npm package in index js

##### Changed src/index.js
```diff
@@ -9,5 +9,6 @@
 ┊ 9┊ 9┊import 'script!lib/ionic/js/ionic-angular';
 ┊10┊10┊import 'script!meteor-client-side/dist/meteor-client-side.bundle';
 ┊11┊11┊import 'script!angular-meteor/dist/angular-meteor.bundle';
+┊  ┊12┊import 'script!angular-moment/angular-moment';
 ┊12┊13┊// app
 ┊13┊14┊import './app';
```
[}]: #

[{]: <helper> (diff_step 4.14)
#### Step 4.14: Add angular-moment module to app dependencies

##### Changed src/app.js
```diff
@@ -13,6 +13,7 @@
 ┊13┊13┊
 ┊14┊14┊Angular.module(App, [
 ┊15┊15┊  'angular-meteor',
+┊  ┊16┊  'angularMoment',
 ┊16┊17┊  'ionic'
 ┊17┊18┊]);
```
[}]: #

> *NOTE*: Because it’s an `Angular` extension, we loaded its dependency in our module definition.

Now that we have `angular-moment` ready to use, we will use a filter provided by it in our view:

[{]: <helper> (diff_step 4.15)
#### Step 4.15: Add date format filter to chat view

##### Changed www/templates/chat.html
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊      <div ng-repeat="message in chat.messages" class="message-wrapper">
 ┊ 9┊ 9┊        <div class="message" ng-class-even="'message-mine'" ng-class-odd="'message-other'">
 ┊10┊10┊          <div class="message-text">{{ message.text }}</div>
-┊11┊  ┊          <span class="message-timestamp">{{ message.timestamp }}</span>
+┊  ┊11┊          <span class="message-timestamp">{{ message.timestamp | amDateFormat: 'HH:MM' }}</span>
 ┊12┊12┊        </div>
 ┊13┊13┊      </div>
 ┊14┊14┊    </div>
```
[}]: #

Our messages are set, but there is one really important feature missing and that's sending messages. Let's implement our message editor.

We will start with the view itself. We will add an input for editing our messages, a `send` button and some icons for sending images and sound recordings, whom logic won't be implemented in this tutorial since we only wanna focus on the messaging system.

The `ionic-footer-bar` directive provides a perfect solution for placing stuff under our content, let's use it:

[{]: <helper> (diff_step 4.16)
#### Step 4.16: Add message editor to chat view

##### Changed www/templates/chat.html
```diff
@@ -13,4 +13,24 @@
 ┊13┊13┊      </div>
 ┊14┊14┊    </div>
 ┊15┊15┊  </ion-content>
+┊  ┊16┊
+┊  ┊17┊  <ion-footer-bar keyboard-attach class="bar-stable footer-chat item-input-inset">
+┊  ┊18┊    <button class="button button-clear button-icon button-positive icon ion-ios-upload-outline"></button>
+┊  ┊19┊
+┊  ┊20┊    <label class="item-input-wrapper">
+┊  ┊21┊      <input ng-model="chat.message"
+┊  ┊22┊             dir="auto"
+┊  ┊23┊             type="text"/>
+┊  ┊24┊    </label>
+┊  ┊25┊
+┊  ┊26┊    <span ng-if="chat.message.length > 0">
+┊  ┊27┊      <button ng-click="chat.sendMessage()" class="button button-clear button-positive">Send</button>
+┊  ┊28┊    </span>
+┊  ┊29┊
+┊  ┊30┊    <span ng-if="!chat.message || chat.message.length === 0">
+┊  ┊31┊      <button class="button button-clear button-icon button-positive icon ion-ios-camera-outline"></button>
+┊  ┊32┊      <i class="buttons-seperator icon ion-android-more-vertical"></i>
+┊  ┊33┊      <button class="button button-clear button-icon button-positive icon ion-ios-mic-outline"></button>
+┊  ┊34┊    </span>
+┊  ┊35┊  </ion-footer-bar>
 ┊16┊36┊</ion-view>🚫↵
```
[}]: #

To improve the user experience in our app, we want some extra events to our input because we want to move it up when the keyboard comes from the bottom of the screen and we want to know if `return` (aka `Enter`) was pressed.

We will implement a new directive that extends the regular `input` tag and add those events to the directive:

[{]: <helper> (diff_step 4.17)
#### Step 4.17: Add input directive

##### Added src/directives/input.directive.js
```diff
@@ -0,0 +1,47 @@
+┊  ┊ 1┊import { Directive } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊
+┊  ┊ 3┊export default class InputDirective extends Directive {
+┊  ┊ 4┊  static $inject = ['$timeout']
+┊  ┊ 5┊  static $name = 'input'
+┊  ┊ 6┊
+┊  ┊ 7┊  restrict = 'E'
+┊  ┊ 8┊
+┊  ┊ 9┊  scope = {
+┊  ┊10┊    'returnClose': '=',
+┊  ┊11┊    'onReturn': '&',
+┊  ┊12┊    'onFocus': '&',
+┊  ┊13┊    'onBlur': '&'
+┊  ┊14┊  }
+┊  ┊15┊
+┊  ┊16┊  link(scope, element) {
+┊  ┊17┊    element.bind('focus', (e) => {
+┊  ┊18┊      if (!scope.onFocus) return;
+┊  ┊19┊
+┊  ┊20┊      this.$timeout(() => {
+┊  ┊21┊        scope.onFocus();
+┊  ┊22┊      });
+┊  ┊23┊    });
+┊  ┊24┊
+┊  ┊25┊    element.bind('blur', (e) => {
+┊  ┊26┊      if (!scope.onBlur) return;
+┊  ┊27┊
+┊  ┊28┊      this.$timeout(() => {
+┊  ┊29┊        scope.onBlur();
+┊  ┊30┊      });
+┊  ┊31┊    });
+┊  ┊32┊
+┊  ┊33┊    element.bind('keydown', (e) => {
+┊  ┊34┊      if (e.which != 13) return;
+┊  ┊35┊
+┊  ┊36┊      if (scope.returnClose) {
+┊  ┊37┊        element[0].blur();
+┊  ┊38┊      }
+┊  ┊39┊
+┊  ┊40┊      if (scope.onReturn) {
+┊  ┊41┊        this.$timeout(() => {
+┊  ┊42┊          scope.onReturn();
+┊  ┊43┊        });
+┊  ┊44┊      }
+┊  ┊45┊    });
+┊  ┊46┊  }
+┊  ┊47┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 4.18)
#### Step 4.18: Load input directive

##### Changed src/app.js
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import ChatCtrl from './controllers/chat.controller';
 ┊ 8┊ 8┊import ChatsCtrl from './controllers/chats.controller';
+┊  ┊ 9┊import InputDirective from './directives/input.directive';
 ┊ 9┊10┊import CalendarFilter from './filters/calendar.filter';
 ┊10┊11┊import RoutesConfig from './routes';
 ┊11┊12┊
```
```diff
@@ -20,6 +21,7 @@
 ┊20┊21┊new Loader(App)
 ┊21┊22┊  .load(ChatCtrl)
 ┊22┊23┊  .load(ChatsCtrl)
+┊  ┊24┊  .load(InputDirective)
 ┊23┊25┊  .load(CalendarFilter)
 ┊24┊26┊  .load(RoutesConfig);
```
[}]: #

And now we can use those events in our view:

[{]: <helper> (diff_step 4.19)
#### Step 4.19: Use input directive events in chat view

##### Changed www/templates/chat.html
```diff
@@ -20,7 +20,10 @@
 ┊20┊20┊    <label class="item-input-wrapper">
 ┊21┊21┊      <input ng-model="chat.message"
 ┊22┊22┊             dir="auto"
-┊23┊  ┊             type="text"/>
+┊  ┊23┊             type="text"
+┊  ┊24┊             on-return="chat.sendMessage(); chat.closeKeyboard()"
+┊  ┊25┊             on-focus="chat.inputUp()"
+┊  ┊26┊             on-blur="chat.inputDown()"/>
 ┊24┊27┊    </label>
 ┊25┊28┊
 ┊26┊29┊    <span ng-if="chat.message.length > 0">
```
[}]: #

And implement the controller methods which handle those events:

[{]: <helper> (diff_step 4.20)
#### Step 4.20: Implement input events in chat controller

##### Changed src/controllers/chat.controller.js
```diff
@@ -1,13 +1,16 @@
+┊  ┊ 1┊import Ionic from 'ionic';
+┊  ┊ 2┊import Keyboard from 'cordova/keyboard';
 ┊ 1┊ 3┊import { Chats, Messages } from 'api/collections';
 ┊ 2┊ 4┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊ 3┊ 5┊
 ┊ 4┊ 6┊export default class ChatCtrl extends Controller {
-┊ 5┊  ┊  static $inject = ['$stateParams']
+┊  ┊ 7┊  static $inject = ['$stateParams', '$timeout', '$ionicScrollDelegate']
 ┊ 6┊ 8┊
 ┊ 7┊ 9┊  constructor() {
 ┊ 8┊10┊    super(...arguments);
 ┊ 9┊11┊
 ┊10┊12┊    this.chatId = this.$stateParams.chatId;
+┊  ┊13┊    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
 ┊11┊14┊
 ┊12┊15┊    this.helpers({
 ┊13┊16┊      messages() {
```
```diff
@@ -18,6 +21,34 @@
 ┊18┊21┊      }
 ┊19┊22┊    });
 ┊20┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  inputUp () {
+┊  ┊26┊    if (this.isIOS) {
+┊  ┊27┊      this.keyboardHeight = 216;
+┊  ┊28┊    }
+┊  ┊29┊
+┊  ┊30┊    this.scrollBottom(true);
+┊  ┊31┊  }
+┊  ┊32┊
+┊  ┊33┊  inputDown () {
+┊  ┊34┊    if (this.isIOS) {
+┊  ┊35┊      this.keyboardHeight = 0;
+┊  ┊36┊    }
+┊  ┊37┊
+┊  ┊38┊    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize();
+┊  ┊39┊  }
+┊  ┊40┊
+┊  ┊41┊  closeKeyboard() {
+┊  ┊42┊    if (Keyboard) {
+┊  ┊43┊      Keyboard.close();
+┊  ┊44┊    }
+┊  ┊45┊  }
+┊  ┊46┊
+┊  ┊47┊  scrollBottom(animate) {
+┊  ┊48┊    this.$timeout(() => {
+┊  ┊49┊      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
+┊  ┊50┊    }, 300);
+┊  ┊51┊  }
 ┊21┊52┊}
 ┊22┊53┊
 ┊23┊54┊ChatCtrl.$name = 'ChatCtrl';🚫↵
```
[}]: #

We will also add some `css` to this view:

[{]: <helper> (diff_step 4.21)
#### Step 4.21: Add footer style to chat stylesheet

##### Changed scss/chat.scss
```diff
@@ -45,7 +45,7 @@
 ┊45┊45┊    background-color: #FFF;
 ┊46┊46┊  }
 ┊47┊47┊
-┊48┊  ┊  &.message-other::before, &.message-mine::before, {
+┊  ┊48┊  &.message-other::before, &.message-mine::before {
 ┊49┊49┊    content: "";
 ┊50┊50┊    position: absolute;
 ┊51┊51┊    bottom: 3px;
```
```diff
@@ -83,4 +83,20 @@
 ┊ 83┊ 83┊    color: gray;
 ┊ 84┊ 84┊    font-size: 12px;
 ┊ 85┊ 85┊  }
+┊   ┊ 86┊}
+┊   ┊ 87┊
+┊   ┊ 88┊.footer-chat {
+┊   ┊ 89┊  .item-input-wrapper {
+┊   ┊ 90┊    background-color: #FFF;
+┊   ┊ 91┊  }
+┊   ┊ 92┊
+┊   ┊ 93┊  .button.button-icon {
+┊   ┊ 94┊    margin: 0 10px;
+┊   ┊ 95┊  }
+┊   ┊ 96┊
+┊   ┊ 97┊  .buttons-seperator {
+┊   ┊ 98┊    color: gray;
+┊   ┊ 99┊    font-size: 18px;
+┊   ┊100┊    line-height: 32px;
+┊   ┊101┊  }
 ┊ 86┊102┊}🚫↵
```
[}]: #

So now when the user focuses on the input, it should pop up.

This is what we got so far:



So now it’s time to implement the `sendMessage()` in our controller, which is responsible for the logic of sending a message.

We will use `Scope.callMethod()` in order to call that method on the server side:

[{]: <helper> (diff_step 4.22)
#### Step 4.22: Implement send message method in chat controller

##### Changed src/controllers/chat.controller.js
```diff
@@ -1,5 +1,6 @@
 ┊1┊1┊import Ionic from 'ionic';
 ┊2┊2┊import Keyboard from 'cordova/keyboard';
+┊ ┊3┊import { _ } from 'meteor/underscore';
 ┊3┊4┊import { Chats, Messages } from 'api/collections';
 ┊4┊5┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊5┊6┊
```
```diff
@@ -22,6 +23,17 @@
 ┊22┊23┊    });
 ┊23┊24┊  }
 ┊24┊25┊
+┊  ┊26┊  sendMessage() {
+┊  ┊27┊    if (_.isEmpty(this.message)) return;
+┊  ┊28┊
+┊  ┊29┊    this.callMethod('newMessage', {
+┊  ┊30┊      text: this.message,
+┊  ┊31┊      chatId: this.chatId
+┊  ┊32┊    });
+┊  ┊33┊
+┊  ┊34┊    delete this.message;
+┊  ┊35┊  }
+┊  ┊36┊
 ┊25┊37┊  inputUp () {
 ┊26┊38┊    if (this.isIOS) {
 ┊27┊39┊      this.keyboardHeight = 216;
```
[}]: #

Now let’s create our `api` method in a file called `methods.js`:

[{]: <helper> (diff_step 4.23)
#### Step 4.23: Add new message method to api

##### Added api/server/methods.js
```diff
@@ -0,0 +1,13 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Chats, Messages } from './collections';
+┊  ┊ 3┊
+┊  ┊ 4┊Meteor.methods({
+┊  ┊ 5┊  newMessage(message) {
+┊  ┊ 6┊    message.timestamp = new Date();
+┊  ┊ 7┊
+┊  ┊ 8┊    const messageId = Messages.insert(message);
+┊  ┊ 9┊    Chats.update(message.chatId, { $set: { lastMessage: message } });
+┊  ┊10┊
+┊  ┊11┊    return messageId;
+┊  ┊12┊  }
+┊  ┊13┊});🚫↵
```
[}]: #

And we also need to load them in our client, since they are called twice, once in our client (As a validation and smoother experience without refreshing) and once in our server (For security and data handling):

[{]: <helper> (diff_step 4.24)
#### Step 4.24: Import api methods in index js

##### Changed src/index.js
```diff
@@ -10,5 +10,7 @@
 ┊10┊10┊import 'script!meteor-client-side/dist/meteor-client-side.bundle';
 ┊11┊11┊import 'script!angular-meteor/dist/angular-meteor.bundle';
 ┊12┊12┊import 'script!angular-moment/angular-moment';
+┊  ┊13┊// api
+┊  ┊14┊import 'api/methods';
 ┊13┊15┊// app
 ┊14┊16┊import './app';
```
[}]: #

We would also like to validate some data sent to methods we define. `Meteor` provides us with a useful package named `check` that validates data types and scheme.

We will add it to our server using the following commands:

    $ cd api
    $ meteor add check

> *NOTE*: `meteor-client-side` is already provided with the `check` package so no need to require it again.

Now let’s use it in the `newMessage()` method:

[{]: <helper> (diff_step 4.26)
#### Step 4.26: Add validation to new message method

##### Changed api/server/methods.js
```diff
@@ -1,8 +1,14 @@
 ┊ 1┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { check } from 'meteor/check';
 ┊ 2┊ 3┊import { Chats, Messages } from './collections';
 ┊ 3┊ 4┊
 ┊ 4┊ 5┊Meteor.methods({
 ┊ 5┊ 6┊  newMessage(message) {
+┊  ┊ 7┊    check(message, {
+┊  ┊ 8┊      text: String,
+┊  ┊ 9┊      chatId: String
+┊  ┊10┊    });
+┊  ┊11┊
 ┊ 6┊12┊    message.timestamp = new Date();
 ┊ 7┊13┊
 ┊ 8┊14┊    const messageId = Messages.insert(message);
```
[}]: #

Now that it's ready you can go ahead and send a message and view it on the screen. It should look like this:

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step3.md) | [Next Step >](step5.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #