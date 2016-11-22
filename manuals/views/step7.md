[{]: <region> (header)
# Step 7: Privacy
[}]: #
[{]: <region> (body)
Right now all the chats are published to all the clients which is not very safe for privacy. Let's fix that.

First thing we need to do inorder to stop all the automatic publication of information is to remove the `autopublish` package from the `Meteor` server. Type in the command line:

    $ meteor remove autopublish

We will add now the [publish-composite](https://atmospherejs.com/reywood/publish-composite) package which will help us implement joined collection pubications.

    $ meteor add reywood:publish-composite

Now we need to explicitly define our publications. Let's start by sending the users' information.

Create a file named `publications.js` under the `api/server` with the following contents:

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

For the `users` collection we only defined a query for publication, and for the `chats` we defined a composite publication where each user will get his relevant chats.

And of course we need to modify some of the client side code, we need to make sure that the client is subscribed to the published data, so let's do so in `NewChatCtrl`, because this is where we need the `users` data:

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

Now we will add a subscription to the `chats` data in the client:

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

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step6.md) | [Next Step >](step8.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #