[{]: <region> (header)
# Step 6: Create and remove chats
[}]: #
[{]: <region> (body)
Our next step is about adding the ability to create new chats. So far we had the chats list and the users feature, we just need to connect them.

We will open the new chat view using `Ionic`'s modal dialog, so first let's add a button that opens this dialog to the chats list:

[{]: <helper> (diff_step 6.1)
#### Step 6.1: Add chat creation button to chats view

##### Changed www/templates/chats.html
```diff
@@ -1,4 +1,8 @@
 ┊1┊1┊<ion-view view-title="Chats">
+┊ ┊2┊  <ion-nav-buttons side="right">
+┊ ┊3┊    <button ng-click="chats.showNewChatModal()" class="button button-clear button-positive button-icon ion-ios-compose-outline"></button>
+┊ ┊4┊  </ion-nav-buttons>
+┊ ┊5┊
 ┊2┊6┊  <ion-content>
 ┊3┊7┊    <ion-list>
 ┊4┊8┊      <ion-item ng-repeat="chat in chats.data | orderBy:'-lastMessage.timestamp'"
```
[}]: #

This button calls a controller method, which we will implement now in the controller:

[{]: <helper> (diff_step 6.2)
#### Step 6.2: Add new chat modal method to chats controller

##### Changed src/controllers/chats.controller.js
```diff
@@ -2,6 +2,8 @@
 ┊2┊2┊import { Controller } from 'angular-ecmascript/module-helpers';
 ┊3┊3┊
 ┊4┊4┊export default class ChatsCtrl extends Controller {
+┊ ┊5┊  static $inject = ['NewChat']
+┊ ┊6┊
 ┊5┊7┊  constructor() {
 ┊6┊8┊    super(...arguments);
 ┊7┊9┊
```
```diff
@@ -12,6 +14,10 @@
 ┊12┊14┊    });
 ┊13┊15┊  }
 ┊14┊16┊
+┊  ┊17┊  showNewChatModal() {
+┊  ┊18┊    this.NewChat.showModal();
+┊  ┊19┊  }
+┊  ┊20┊
 ┊15┊21┊  remove(chat) {
 ┊16┊22┊    this.data.remove(chat._id);
 ┊17┊23┊  }
```
[}]: #

Note that we first create the modal dialog with a template, and then later we open it in the button function.

Inorder to open this modal, we will create a service that takes care of that:

[{]: <helper> (diff_step 6.3)
#### Step 6.3: Add new chat service

##### Added src/services/new-chat.service.js
```diff
@@ -0,0 +1,29 @@
+┊  ┊ 1┊import { Service } from 'angular-ecmascript/module-helpers';
+┊  ┊ 2┊
+┊  ┊ 3┊export default class NewChatService extends Service {
+┊  ┊ 4┊  static $inject = ['$rootScope', '$ionicModal']
+┊  ┊ 5┊  static $name = 'NewChat'
+┊  ┊ 6┊
+┊  ┊ 7┊  constructor() {
+┊  ┊ 8┊    super(...arguments);
+┊  ┊ 9┊
+┊  ┊10┊    this.templateUrl = 'templates/new-chat.html';
+┊  ┊11┊  }
+┊  ┊12┊
+┊  ┊13┊  showModal() {
+┊  ┊14┊    this.scope = this.$rootScope.$new();
+┊  ┊15┊
+┊  ┊16┊    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
+┊  ┊17┊      scope: this.scope
+┊  ┊18┊    })
+┊  ┊19┊    .then((modal) => {
+┊  ┊20┊      this.modal = modal;
+┊  ┊21┊      this.modal.show();
+┊  ┊22┊    });
+┊  ┊23┊  }
+┊  ┊24┊
+┊  ┊25┊  hideModal() {
+┊  ┊26┊    this.scope.$destroy();
+┊  ┊27┊    this.modal.remove();
+┊  ┊28┊  }
+┊  ┊29┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 6.4)
#### Step 6.4: Load new chat service

##### Changed src/app.js
```diff
@@ -12,6 +12,7 @@
 ┊12┊12┊import SettingsCtrl from './controllers/settings.controller';
 ┊13┊13┊import InputDirective from './directives/input.directive';
 ┊14┊14┊import CalendarFilter from './filters/calendar.filter';
+┊  ┊15┊import NewChatService from './services/new-chat.service';
 ┊15┊16┊import Routes from './routes';
 ┊16┊17┊
 ┊17┊18┊const App = 'whatsapp';
```
```diff
@@ -32,6 +33,7 @@
 ┊32┊33┊  .load(SettingsCtrl)
 ┊33┊34┊  .load(InputDirective)
 ┊34┊35┊  .load(CalendarFilter)
+┊  ┊36┊  .load(NewChatService)
 ┊35┊37┊  .load(Routes);
 ┊36┊38┊
 ┊37┊39┊Ionic.Platform.ready(() => {
```
[}]: #

Now let's add the view of this modal dialog, which is just a list of users:

[{]: <helper> (diff_step 6.5)
#### Step 6.5: Add new chat view

##### Added www/templates/new-chat.html
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊
+┊  ┊ 2┊<ion-modal-view ng-controller="NewChatCtrl as chat">
+┊  ┊ 3┊  <ion-header-bar>
+┊  ┊ 4┊    <h1 class="title">New Chat</h1>
+┊  ┊ 5┊    <div class="buttons">
+┊  ┊ 6┊      <button class="button button-clear button-positive" ng-click="chat.hideNewChatModal()">Cancel</button>
+┊  ┊ 7┊    </div>
+┊  ┊ 8┊  </ion-header-bar>
+┊  ┊ 9┊
+┊  ┊10┊  <ion-content>
+┊  ┊11┊    <div class="list">
+┊  ┊12┊      <a ng-repeat="user in chat.users" ng-click="chat.newChat(user._id)" class="item">
+┊  ┊13┊        <h2>{{user.profile.name}}</h2>
+┊  ┊14┊        <p>
+┊  ┊15┊          Hey there! I am using meteor-Whatsapp with meteor.
+┊  ┊16┊        </p>
+┊  ┊17┊      </a>
+┊  ┊18┊    </div>
+┊  ┊19┊  </ion-content>
+┊  ┊20┊</ion-modal-view>🚫↵
```
[}]: #

And now we will add the controller of this view, and use the `NewChat` service:

[{]: <helper> (diff_step 6.6)
#### Step 6.6: Add new chat controller

##### Added src/controllers/new-chat.controller.js
```diff
@@ -0,0 +1,52 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Chats } from 'api/collections';
+┊  ┊ 3┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class NewChatCtrl extends Controller {
+┊  ┊ 6┊  static $inject = ['$state', 'NewChat', '$ionicPopup', '$log']
+┊  ┊ 7┊
+┊  ┊ 8┊  constructor() {
+┊  ┊ 9┊    super(...arguments);
+┊  ┊10┊
+┊  ┊11┊    this.helpers({
+┊  ┊12┊      users() {
+┊  ┊13┊        return Meteor.users.find({ _id: { $ne: this.currentUserId } });
+┊  ┊14┊      }
+┊  ┊15┊    });
+┊  ┊16┊  }
+┊  ┊17┊
+┊  ┊18┊  newChat(userId) {
+┊  ┊19┊    let chat = Chats.findOne({ userIds: { $all: [this.currentUserId, userId] } });
+┊  ┊20┊
+┊  ┊21┊    if (chat) {
+┊  ┊22┊      this.hideNewChatModal();
+┊  ┊23┊      return this.goToChat(chat._id);
+┊  ┊24┊    }
+┊  ┊25┊
+┊  ┊26┊    this.callMethod('newChat', userId, (err, chatId) => {
+┊  ┊27┊      this.hideNewChatModal();
+┊  ┊28┊      if (err) return this.handleError(err);
+┊  ┊29┊      this.goToChat(chatId);
+┊  ┊30┊    });
+┊  ┊31┊  }
+┊  ┊32┊
+┊  ┊33┊  hideNewChatModal() {
+┊  ┊34┊    this.NewChat.hideModal();
+┊  ┊35┊  }
+┊  ┊36┊
+┊  ┊37┊  goToChat(chatId) {
+┊  ┊38┊    this.$state.go('tab.chat', { chatId });
+┊  ┊39┊  }
+┊  ┊40┊
+┊  ┊41┊  handleError(err) {
+┊  ┊42┊    this.$log.error('New chat creation error ', err);
+┊  ┊43┊
+┊  ┊44┊    this.$ionicPopup.alert({
+┊  ┊45┊      title: err.reason || 'New chat creation failed',
+┊  ┊46┊      template: 'Please try again',
+┊  ┊47┊      okType: 'button-positive button-clear'
+┊  ┊48┊    });
+┊  ┊49┊  }
+┊  ┊50┊}
+┊  ┊51┊
+┊  ┊52┊NewChatCtrl.$name = 'NewChatCtrl';🚫↵
```
[}]: #

[{]: <helper> (diff_step 6.7)
#### Step 6.7: Load new chat controller

##### Changed src/app.js
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊import ChatsCtrl from './controllers/chats.controller';
 ┊ 9┊ 9┊import ConfirmationCtrl from './controllers/confirmation.controller';
 ┊10┊10┊import LoginCtrl from './controllers/login.controller';
+┊  ┊11┊import NewChatCtrl from './controllers/new-chat.controller';
 ┊11┊12┊import ProfileCtrl from './controllers/profile.controller';
 ┊12┊13┊import SettingsCtrl from './controllers/settings.controller';
 ┊13┊14┊import InputDirective from './directives/input.directive';
```
```diff
@@ -29,6 +30,7 @@
 ┊29┊30┊  .load(ChatsCtrl)
 ┊30┊31┊  .load(ConfirmationCtrl)
 ┊31┊32┊  .load(LoginCtrl)
+┊  ┊33┊  .load(NewChatCtrl)
 ┊32┊34┊  .load(ProfileCtrl)
 ┊33┊35┊  .load(SettingsCtrl)
 ┊34┊36┊  .load(InputDirective)
```
[}]: #

The controller includes a server method for creating a chat which is not yet implemented, so let's create it:

[{]: <helper> (diff_step 6.8)
#### Step 6.8: Add new chat method to api

##### Changed api/server/methods.js
```diff
@@ -36,5 +36,29 @@
 ┊36┊36┊    }
 ┊37┊37┊
 ┊38┊38┊    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
+┊  ┊39┊  },
+┊  ┊40┊
+┊  ┊41┊  newChat(otherId) {
+┊  ┊42┊    if (!this.userId) {
+┊  ┊43┊      throw new Meteor.Error('not-logged-in',
+┊  ┊44┊        'Must be logged to create a chat.');
+┊  ┊45┊    }
+┊  ┊46┊
+┊  ┊47┊    check(otherId, String);
+┊  ┊48┊    const otherUser = Meteor.users.findOne(otherId);
+┊  ┊49┊
+┊  ┊50┊    if (!otherUser) {
+┊  ┊51┊      throw new Meteor.Error('user-not-exists',
+┊  ┊52┊        'Chat\'s user not exists');
+┊  ┊53┊    }
+┊  ┊54┊
+┊  ┊55┊    const chat = {
+┊  ┊56┊      userIds: [this.userId, otherId],
+┊  ┊57┊      createdAt: new Date()
+┊  ┊58┊    };
+┊  ┊59┊
+┊  ┊60┊    const chatId = Chats.insert(chat);
+┊  ┊61┊
+┊  ┊62┊    return chatId;
 ┊39┊63┊  }
 ┊40┊64┊});🚫↵
```
[}]: #

We will also rewrite the logic of `removeChat()` function in the `ChatsCtrl` and we will call a server method instead (which we will explain why further in this tutorial):

[{]: <helper> (diff_step 6.9)
#### Step 6.9: Replace manual chat removal with method invokation in chats controller

##### Changed src/controllers/chats.controller.js
```diff
@@ -19,7 +19,7 @@
 ┊19┊19┊  }
 ┊20┊20┊
 ┊21┊21┊  remove(chat) {
-┊22┊  ┊    this.data.remove(chat._id);
+┊  ┊22┊    this.callMethod('removeChat', chat._id);
 ┊23┊23┊  }
 ┊24┊24┊}
```
[}]: #

And we will implement the method on the server:

[{]: <helper> (diff_step 6.10)
#### Step 6.10: Add chat removal method to api

##### Changed api/server/methods.js
```diff
@@ -60,5 +60,25 @@
 ┊60┊60┊    const chatId = Chats.insert(chat);
 ┊61┊61┊
 ┊62┊62┊    return chatId;
+┊  ┊63┊  },
+┊  ┊64┊
+┊  ┊65┊  removeChat(chatId) {
+┊  ┊66┊    if (!this.userId) {
+┊  ┊67┊      throw new Meteor.Error('not-logged-in',
+┊  ┊68┊        'Must be logged to create a chat.');
+┊  ┊69┊    }
+┊  ┊70┊
+┊  ┊71┊    check(chatId, String);
+┊  ┊72┊
+┊  ┊73┊    const chat = Chats.findOne(chatId);
+┊  ┊74┊
+┊  ┊75┊    if (!chat || !_.include(chat.userIds, this.userId)) {
+┊  ┊76┊      throw new Meteor.Error('chat-not-exists',
+┊  ┊77┊        'Chat not exists');
+┊  ┊78┊    }
+┊  ┊79┊
+┊  ┊80┊    Messages.remove({ chatId: chatId });
+┊  ┊81┊
+┊  ┊82┊    return Chats.remove({ _id: chatId });
 ┊63┊83┊  }
 ┊64┊84┊});🚫↵
```
[}]: #

The next messages won't include the username, only the user id, so we need to change the logic of username display. We will add a filter that fetches the user object from the `Users` collection according to the `userId` property of the chat object:

[{]: <helper> (diff_step 6.11)
#### Step 6.11: Add chat name filter

##### Added src/filters/chat-name.filter.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { Filter } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class ChatNameFilter extends Filter {
+┊  ┊ 6┊  static $name = 'chatName'
+┊  ┊ 7┊
+┊  ┊ 8┊  filter(chat) {
+┊  ┊ 9┊    if (!chat) return;
+┊  ┊10┊
+┊  ┊11┊    let otherId = _.without(chat.userIds, Meteor.userId())[0];
+┊  ┊12┊    let otherUser = Meteor.users.findOne(otherId);
+┊  ┊13┊    let hasName = otherUser && otherUser.profile && otherUser.profile.name;
+┊  ┊14┊
+┊  ┊15┊    return hasName ? otherUser.profile.name : chat.name || 'NO NAME';
+┊  ┊16┊  }
+┊  ┊17┊}🚫↵
```
[}]: #

And we will also create the same logic for fetching the user's image:

[{]: <helper> (diff_step 6.12)
#### Step 6.12: Add chat picture filter

##### Added src/filters/chat-picture.filter.js
```diff
@@ -0,0 +1,17 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 3┊import { Filter } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class ChatPictureFilter extends Filter {
+┊  ┊ 6┊  static $name = 'chatPicture'
+┊  ┊ 7┊
+┊  ┊ 8┊  filter(chat) {
+┊  ┊ 9┊    if (!chat) return;
+┊  ┊10┊
+┊  ┊11┊    let otherId = _.without(chat.userIds, Meteor.userId())[0];
+┊  ┊12┊    let otherUser = Meteor.users.findOne(otherId);
+┊  ┊13┊    let hasPicture = otherUser && otherUser.profile && otherUser.profile.picture;
+┊  ┊14┊
+┊  ┊15┊    return hasPicture ? otherUser.profile.picture : chat.picture || '/img/user-default.svg';
+┊  ┊16┊  }
+┊  ┊17┊}🚫↵
```
[}]: #

And we will load our filters:

[{]: <helper> (diff_step 6.13)
#### Step 6.13: Load chat name and picture filters

##### Changed src/app.js
```diff
@@ -13,6 +13,8 @@
 ┊13┊13┊import SettingsCtrl from './controllers/settings.controller';
 ┊14┊14┊import InputDirective from './directives/input.directive';
 ┊15┊15┊import CalendarFilter from './filters/calendar.filter';
+┊  ┊16┊import ChatNameFilter from './filters/chat-name.filter';
+┊  ┊17┊import ChatPictureFilter from './filters/chat-picture.filter';
 ┊16┊18┊import NewChatService from './services/new-chat.service';
 ┊17┊19┊import Routes from './routes';
 ┊18┊20┊
```
```diff
@@ -35,6 +37,8 @@
 ┊35┊37┊  .load(SettingsCtrl)
 ┊36┊38┊  .load(InputDirective)
 ┊37┊39┊  .load(CalendarFilter)
+┊  ┊40┊  .load(ChatNameFilter)
+┊  ┊41┊  .load(ChatPictureFilter)
 ┊38┊42┊  .load(NewChatService)
 ┊39┊43┊  .load(Routes);
```
[}]: #

And we will add the usage of these filters in the chats list view:

[{]: <helper> (diff_step 6.14)
#### Step 6.14: Apply chat name and picture filters in chats view

##### Changed www/templates/chats.html
```diff
@@ -9,8 +9,8 @@
 ┊ 9┊ 9┊                class="item-chat item-remove-animate item-avatar item-icon-right"
 ┊10┊10┊                type="item-text-wrap"
 ┊11┊11┊                href="#/tab/chats/{{ chat._id }}">
-┊12┊  ┊        <img ng-src="{{ chat.picture }}">
-┊13┊  ┊        <h2>{{ chat.name }}</h2>
+┊  ┊12┊        <img ng-src="{{ chat | chatPicture }}">
+┊  ┊13┊        <h2>{{ chat | chatName }}</h2>
 ┊14┊14┊        <p>{{ chat.lastMessage.text }}</p>
 ┊15┊15┊        <span class="last-message-timestamp">{{ chat.lastMessage.timestamp | calendar }}</span>
 ┊16┊16┊        <i class="icon ion-chevron-right icon-accessory"></i>
```
[}]: #

And in the chat view:

[{]: <helper> (diff_step 6.15)
#### Step 6.15: Apply chat name and picture filters in chat view

##### Changed www/templates/chat.html
```diff
@@ -1,6 +1,6 @@
-┊1┊ ┊<ion-view title="{{ chat.data.name }}">
+┊ ┊1┊<ion-view title="{{ chat.data | chatName }}">
 ┊2┊2┊  <ion-nav-buttons side="right">
-┊3┊ ┊    <button class="button button-clear"><img class="header-picture" ng-src="{{ chat.data.picture }}"></button>
+┊ ┊3┊    <button class="button button-clear"><img class="header-picture" ng-src="{{ chat.data | chatPicture }}"></button>
 ┊4┊4┊  </ion-nav-buttons>
 ┊5┊5┊
 ┊6┊6┊  <ion-content class="chat" delegate-handle="chatScroll">
```
[}]: #

Now we want to get rid of the current data we have, which is just a static data.

So let's stop our `Meteor`'s server and reset the whole app by running:

    $ meteor reset

Let's add some users to the server instead of the old static data:

[{]: <helper> (diff_step 6.16)
#### Step 6.16: Create initial users with phone data stubs

##### Changed api/server/bootstrap.js
```diff
@@ -1,66 +1,27 @@
-┊ 1┊  ┊import Moment from 'moment';
 ┊ 2┊ 1┊import { Meteor } from 'meteor/meteor';
-┊ 3┊  ┊import { Chats, Messages } from './collections';
+┊  ┊ 2┊import { Accounts } from 'meteor/accounts-base';
 ┊ 4┊ 3┊
 ┊ 5┊ 4┊Meteor.startup(function() {
-┊ 6┊  ┊  if (Chats.find().count() !== 0) return;
+┊  ┊ 5┊  if (Meteor.users.find().count() != 0) return;
 ┊ 7┊ 6┊
-┊ 8┊  ┊  Messages.remove({});
-┊ 9┊  ┊
-┊10┊  ┊  const messages = [
-┊11┊  ┊    {
-┊12┊  ┊      text: 'You on your way?',
-┊13┊  ┊      timestamp: Moment().subtract(1, 'hours').toDate()
-┊14┊  ┊    },
-┊15┊  ┊    {
-┊16┊  ┊      text: 'Hey, it\'s me',
-┊17┊  ┊      timestamp: Moment().subtract(2, 'hours').toDate()
-┊18┊  ┊    },
-┊19┊  ┊    {
-┊20┊  ┊      text: 'I should buy a boat',
-┊21┊  ┊      timestamp: Moment().subtract(1, 'days').toDate()
-┊22┊  ┊    },
-┊23┊  ┊    {
-┊24┊  ┊      text: 'Look at my mukluks!',
-┊25┊  ┊      timestamp: Moment().subtract(4, 'days').toDate()
-┊26┊  ┊    },
-┊27┊  ┊    {
-┊28┊  ┊      text: 'This is wicked good ice cream.',
-┊29┊  ┊      timestamp: Moment().subtract(2, 'weeks').toDate()
+┊  ┊ 7┊  Accounts.createUserWithPhone({
+┊  ┊ 8┊    phone: '+972501234567',
+┊  ┊ 9┊    profile: {
+┊  ┊10┊      name: 'My friend 1'
 ┊30┊11┊    }
-┊31┊  ┊  ];
-┊32┊  ┊
-┊33┊  ┊  messages.forEach((m) => {
-┊34┊  ┊    Messages.insert(m);
 ┊35┊12┊  });
 ┊36┊13┊
-┊37┊  ┊  const chats = [
-┊38┊  ┊    {
-┊39┊  ┊      name: 'Ethan Gonzalez',
-┊40┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
-┊41┊  ┊    },
-┊42┊  ┊    {
-┊43┊  ┊      name: 'Bryan Wallace',
-┊44┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
-┊45┊  ┊    },
-┊46┊  ┊    {
-┊47┊  ┊      name: 'Avery Stewart',
-┊48┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
-┊49┊  ┊    },
-┊50┊  ┊    {
-┊51┊  ┊      name: 'Katie Peterson',
-┊52┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
-┊53┊  ┊    },
-┊54┊  ┊    {
-┊55┊  ┊      name: 'Ray Edwards',
-┊56┊  ┊      picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
+┊  ┊14┊  Accounts.createUserWithPhone({
+┊  ┊15┊    phone: '+972501234568',
+┊  ┊16┊    profile: {
+┊  ┊17┊      name: 'My friend 2'
 ┊57┊18┊    }
-┊58┊  ┊  ];
+┊  ┊19┊  });
 ┊59┊20┊
-┊60┊  ┊  chats.forEach((chat) => {
-┊61┊  ┊    const message = Messages.findOne({ chatId: { $exists: false } });
-┊62┊  ┊    chat.lastMessage = message;
-┊63┊  ┊    const chatId = Chats.insert(chat);
-┊64┊  ┊    Messages.update(message._id, { $set: { chatId } });
+┊  ┊21┊  Accounts.createUserWithPhone({
+┊  ┊22┊    phone: '+972501234569',
+┊  ┊23┊    profile: {
+┊  ┊24┊      name: 'My friend 3'
+┊  ┊25┊    }
 ┊65┊26┊  });
 ┊66┊27┊});🚫↵
```
[}]: #

Run it again.

Cool! Now once we click a user a new chat should be created with it.

Our last part of this step is to remove `Meteor`'s package named `insecure`.

This package provides the ability to run `remove()` method from the client side in our collection. This is a behavior we do not want to use because removing data and creating data should be done in the server and only after certain validations, and this is the reason for implementing the `removeChat()` method in the server.

`Meteor` includes this package only for development purposes and it should be removed once our app is ready for production.

So remote this package by running this command:

    $ meteor remove insecure
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step5.md) | [Next Step >](step7.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #