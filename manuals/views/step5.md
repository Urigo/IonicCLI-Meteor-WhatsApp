[{]: <region> (header)
# Step 5: Authentication
[}]: #
[{]: <region> (body)
On this step we will authenticate and identify users in our app.

Before we go ahead and start extending our app, we will add few packages which will make our lives a bit less complex when it comes to authentication and users management.

Firt we will update our `api` and add a meteor package called `accounts-phone` which gives us the ability to verify a user using an SMS code:

    $ meteor add npm-bcrypt@0.8.7
    $ meteor add mys:accounts-phone

And second, we will update the client, and add authentication packages to it. We will add `accounts-phone` which is the same package we installed in our `api`, only this time it's for the client, and `angular-meteor-auth` which is an extension for `Angular` based on `angular-meteor`, and it contains different utility functions to help us implement authentication.

In terminal, type:

    $ npm install accounts-phone --save
    $ npm install angular-meteor-auth --save

And import them in our `index.js`:

[{]: <helper> (diff_step 5.3)
#### Step 5.3: Import auth modules in index js

##### Changed src/index.js
```diff
@@ -8,7 +8,10 @@
 ┊ 8┊ 8┊import 'script!lib/ionic/js/ionic';
 ┊ 9┊ 9┊import 'script!lib/ionic/js/ionic-angular';
 ┊10┊10┊import 'script!meteor-client-side/dist/meteor-client-side.bundle';
+┊  ┊11┊import 'script!accounts-base-client-side/dist/accounts-base-client-side.bundle';
+┊  ┊12┊import 'script!accounts-phone/dist/accounts-phone.bundle.min';
 ┊11┊13┊import 'script!angular-meteor/dist/angular-meteor.bundle';
+┊  ┊14┊import 'script!angular-meteor-auth/dist/angular-meteor-auth';
 ┊12┊15┊import 'script!angular-moment/angular-moment';
 ┊13┊16┊// api
 ┊14┊17┊import 'api/methods';
```
[}]: #

And since `angular-meteor-auth` is an `Angular` extension we will need to add it as a module dependency in our app:

[{]: <helper> (diff_step 5.4)
#### Step 5.4: Add angular-meteor-auth module to app dependencies

##### Changed src/app.js
```diff
@@ -14,6 +14,7 @@
 ┊14┊14┊
 ┊15┊15┊Angular.module(App, [
 ┊16┊16┊  'angular-meteor',
+┊  ┊17┊  'angular-meteor.auth',
 ┊17┊18┊  'angularMoment',
 ┊18┊19┊  'ionic'
 ┊19┊20┊]);
```
[}]: #

Inorder to make the SMS verification work we will need to create a file locaed in `api/server/sms.js` with the following contents:

[{]: <helper> (diff_step 5.5)
#### Step 5.5: Add sms configuration to api

##### Added api/server/sms.js
```diff
@@ -0,0 +1,7 @@
+┊ ┊1┊import { Meteor } from 'meteor/meteor';
+┊ ┊2┊import { Accounts } from 'meteor/accounts-base';
+┊ ┊3┊
+┊ ┊4┊if (Meteor.settings && Meteor.settings.ACCOUNTS_PHONE) {
+┊ ┊5┊  Accounts._options.adminPhoneNumbers = Meteor.settings.ACCOUNTS_PHONE.ADMIN_NUMBERS;
+┊ ┊6┊  Accounts._options.phoneVerificationMasterCode = Meteor.settings.ACCOUNTS_PHONE.MASTER_CODE;
+┊ ┊7┊}🚫↵
```
[}]: #

If you would like to test the verification with a real phone number, `accouts-phone` provides an easy access for [twilio's API](https://www.twilio.com/), for more information see [accounts-phone's repo](https://github.com/okland/accounts-phone).

For debugging purposes if you'd like to add admin phone numbers and mater verification codes which will always pass the verification stage, you may add a `settings.json` file at the root folder with the following fields:

    {
      "ACCOUNTS_PHONE": {
        "ADMIN_NUMBERS": ["123456789", "987654321"],
        "MASTER_CODE": "1234"
      }
    }

We're going to create the same flow of `Whatsapp` for authentication using 3 views:

- `Login` - Asks for the user's phone number.
- `Confirmation` - Verifies a user's phone number by an SMS authentication.
- `Profile` - Asks a user to pickup its name.

Before we jump into implementing them, we will add a pre-requirement to the relevant routes which require the user to log-in first. `angular-meteor-auth` provides us with a service which is called `$auth`, and it has a method called `$awaitUser()` which returns a promise that will be resolved only once the user has logged in. For more information about `angular-meteor-auth` see [reference](http://www.angular-meteor.com/api/1.3.6/auth).

[{]: <helper> (diff_step 5.6)
#### Step 5.6: Add auth resolve to route states

##### Changed src/routes.js
```diff
@@ -3,12 +3,21 @@
 ┊ 3┊ 3┊export default class RoutesConfig extends Config {
 ┊ 4┊ 4┊  static $inject = ['$stateProvider', '$urlRouterProvider']
 ┊ 5┊ 5┊
+┊  ┊ 6┊  constructor() {
+┊  ┊ 7┊    super(...arguments);
+┊  ┊ 8┊
+┊  ┊ 9┊    this.isAuthorized = ['$auth', this::this.isAuthorized];
+┊  ┊10┊  }
+┊  ┊11┊
 ┊ 6┊12┊  configure() {
 ┊ 7┊13┊    this.$stateProvider
 ┊ 8┊14┊      .state('tab', {
 ┊ 9┊15┊        url: '/tab',
 ┊10┊16┊        abstract: true,
-┊11┊  ┊        templateUrl: 'templates/tabs.html'
+┊  ┊17┊        templateUrl: 'templates/tabs.html',
+┊  ┊18┊        resolve: {
+┊  ┊19┊          user: this.isAuthorized
+┊  ┊20┊        }
 ┊12┊21┊      })
 ┊13┊22┊      .state('tab.chats', {
 ┊14┊23┊        url: '/chats',
```
```diff
@@ -31,4 +40,8 @@
 ┊31┊40┊
 ┊32┊41┊    this.$urlRouterProvider.otherwise('tab/chats');
 ┊33┊42┊  }
+┊  ┊43┊
+┊  ┊44┊  isAuthorized($auth) {
+┊  ┊45┊    return $auth.awaitUser();
+┊  ┊46┊  }
 ┊34┊47┊}🚫↵
```
[}]: #

And now we want to handle a case where this promise does not resolve (In case the user is not logged in), so let’s create new `RouteConfig` that uses `Angular`'s config phase:

[{]: <helper> (diff_step 5.7)
#### Step 5.7: Add routes runner to handle route state change error

##### Changed src/routes.js
```diff
@@ -1,6 +1,7 @@
-┊1┊ ┊import { Config } from 'angular-ecmascript/module-helpers';
+┊ ┊1┊import { _ } from 'meteor/underscore';
+┊ ┊2┊import { Config, Runner } from 'angular-ecmascript/module-helpers';
 ┊2┊3┊
-┊3┊ ┊export default class RoutesConfig extends Config {
+┊ ┊4┊class RoutesConfig extends Config {
 ┊4┊5┊  static $inject = ['$stateProvider', '$urlRouterProvider']
 ┊5┊6┊
 ┊6┊7┊  constructor() {
```
```diff
@@ -44,4 +45,20 @@
 ┊44┊45┊  isAuthorized($auth) {
 ┊45┊46┊    return $auth.awaitUser();
 ┊46┊47┊  }
-┊47┊  ┊}🚫↵
+┊  ┊48┊}
+┊  ┊49┊
+┊  ┊50┊class RoutesRunner extends Runner {
+┊  ┊51┊  static $inject = ['$rootScope', '$state']
+┊  ┊52┊
+┊  ┊53┊  run() {
+┊  ┊54┊    this.$rootScope.$on('$stateChangeError', (...args) => {
+┊  ┊55┊      const err = _.last(args);
+┊  ┊56┊
+┊  ┊57┊      if (err === 'AUTH_REQUIRED') {
+┊  ┊58┊        this.$state.go('login');
+┊  ┊59┊      }
+┊  ┊60┊    });
+┊  ┊61┊  }
+┊  ┊62┊}
+┊  ┊63┊
+┊  ┊64┊export default [RoutesConfig, RoutesRunner];🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.8)
#### Step 5.8: Load routes runner

##### Changed src/app.js
```diff
@@ -8,7 +8,7 @@
 ┊ 8┊ 8┊import ChatsCtrl from './controllers/chats.controller';
 ┊ 9┊ 9┊import InputDirective from './directives/input.directive';
 ┊10┊10┊import CalendarFilter from './filters/calendar.filter';
-┊11┊  ┊import RoutesConfig from './routes';
+┊  ┊11┊import Routes from './routes';
 ┊12┊12┊
 ┊13┊13┊const App = 'whatsapp';
 ┊14┊14┊
```
```diff
@@ -24,7 +24,7 @@
 ┊24┊24┊  .load(ChatsCtrl)
 ┊25┊25┊  .load(InputDirective)
 ┊26┊26┊  .load(CalendarFilter)
-┊27┊  ┊  .load(RoutesConfig);
+┊  ┊27┊  .load(Routes);
 ┊28┊28┊
 ┊29┊29┊Ionic.Platform.ready(() => {
 ┊30┊30┊  if (Keyboard) {
```
[}]: #

Cool, now that we're set, let's start implementing the views we mentioned earlier. We will start with the login view.

The login view contains an input and a save button, and after the save button has been saved, we should be forwarded to the confirmation view, right after an SMS has been sent to the entered phone number:

[{]: <helper> (diff_step 5.9)
#### Step 5.9: Add login view

##### Added www/templates/login.html
```diff
@@ -0,0 +1,15 @@
+┊  ┊ 1┊<ion-view title="Your phone number">
+┊  ┊ 2┊  <ion-nav-buttons side="right">
+┊  ┊ 3┊    <button ng-click="logger.login()" ng-disabled="!logger.phone || logger.phone.length === 0" class="button button-clear button-positive">Done</button>
+┊  ┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊  <ion-content class="login">
+┊  ┊ 6┊    <div class="text-center instructions">
+┊  ┊ 7┊      Please confirm your country code and enter your phone number
+┊  ┊ 8┊    </div>
+┊  ┊ 9┊    <div class="list">
+┊  ┊10┊      <label class="item item-input">
+┊  ┊11┊        <input ng-model="logger.phone" on-return="logger.login()" type="text" placeholder="Your phone number">
+┊  ┊12┊      </label>
+┊  ┊13┊    </div>
+┊  ┊14┊  </ion-content>
+┊  ┊15┊</ion-view>🚫↵
```
[}]: #

And for the controller - the logic is simple. We ask the user to check again his phone number, and then we will use `accounts` API in order to ask for SMS verification:

[{]: <helper> (diff_step 5.10)
#### Step 5.10: Add login controller

##### Added src/controllers/login.controller.js
```diff
@@ -0,0 +1,47 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 3┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class LoginCtrl extends Controller {
+┊  ┊ 6┊  static $inject = ['$state', '$ionicLoading', '$ionicPopup', '$log']
+┊  ┊ 7┊
+┊  ┊ 8┊  login() {
+┊  ┊ 9┊    if (_.isEmpty(this.phone)) return;
+┊  ┊10┊
+┊  ┊11┊    const confirmPopup = this.$ionicPopup.confirm({
+┊  ┊12┊      title: 'Number confirmation',
+┊  ┊13┊      template: '<div>' + this.phone + '</div><div>Is your phone number above correct?</div>',
+┊  ┊14┊      cssClass: 'text-center',
+┊  ┊15┊      okText: 'Yes',
+┊  ┊16┊      okType: 'button-positive button-clear',
+┊  ┊17┊      cancelText: 'edit',
+┊  ┊18┊      cancelType: 'button-dark button-clear'
+┊  ┊19┊    });
+┊  ┊20┊
+┊  ┊21┊    confirmPopup.then((res) => {
+┊  ┊22┊      if (!res) return;
+┊  ┊23┊
+┊  ┊24┊      this.$ionicLoading.show({
+┊  ┊25┊        template: 'Sending verification code...'
+┊  ┊26┊      });
+┊  ┊27┊
+┊  ┊28┊      Accounts.requestPhoneVerification(this.phone, (err) => {
+┊  ┊29┊        this.$ionicLoading.hide();
+┊  ┊30┊        if (err) return this.handleError(err);
+┊  ┊31┊        this.$state.go('confirmation', { phone: this.phone });
+┊  ┊32┊      });
+┊  ┊33┊    });
+┊  ┊34┊  }
+┊  ┊35┊
+┊  ┊36┊  handleError(err) {
+┊  ┊37┊    this.$log.error('Login error ', err);
+┊  ┊38┊
+┊  ┊39┊    this.$ionicPopup.alert({
+┊  ┊40┊      title: err.reason || 'Login failed',
+┊  ┊41┊      template: 'Please try again',
+┊  ┊42┊      okType: 'button-positive button-clear'
+┊  ┊43┊    });
+┊  ┊44┊  }
+┊  ┊45┊}
+┊  ┊46┊
+┊  ┊47┊LoginCtrl.$name = 'LoginCtrl';🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.11)
#### Step 5.11: Load login controller

##### Changed src/app.js
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import ChatCtrl from './controllers/chat.controller';
 ┊ 8┊ 8┊import ChatsCtrl from './controllers/chats.controller';
+┊  ┊ 9┊import LoginCtrl from './controllers/login.controller';
 ┊ 9┊10┊import InputDirective from './directives/input.directive';
 ┊10┊11┊import CalendarFilter from './filters/calendar.filter';
 ┊11┊12┊import Routes from './routes';
```
```diff
@@ -22,6 +23,7 @@
 ┊22┊23┊new Loader(App)
 ┊23┊24┊  .load(ChatCtrl)
 ┊24┊25┊  .load(ChatsCtrl)
+┊  ┊26┊  .load(LoginCtrl)
 ┊25┊27┊  .load(InputDirective)
 ┊26┊28┊  .load(CalendarFilter)
 ┊27┊29┊  .load(Routes);
```
[}]: #

Let's add its route state:

[{]: <helper> (diff_step 5.12)
#### Step 5.12: Add login route state

##### Changed src/routes.js
```diff
@@ -37,6 +37,11 @@
 ┊37┊37┊            controller: 'ChatCtrl as chat'
 ┊38┊38┊          }
 ┊39┊39┊        }
+┊  ┊40┊      })
+┊  ┊41┊      .state('login', {
+┊  ┊42┊        url: '/login',
+┊  ┊43┊        templateUrl: 'templates/login.html',
+┊  ┊44┊        controller: 'LoginCtrl as logger'
 ┊40┊45┊      });
 ┊41┊46┊
 ┊42┊47┊    this.$urlRouterProvider.otherwise('tab/chats');
```
[}]: #

And some style:

[{]: <helper> (diff_step 5.13)
#### Step 5.13: Add login stylesheet

##### Added scss/login.scss
```diff
@@ -0,0 +1,6 @@
+┊ ┊1┊.login {
+┊ ┊2┊  .instructions {
+┊ ┊3┊    margin: 50px 0;
+┊ ┊4┊    padding: 0 15px;
+┊ ┊5┊  }
+┊ ┊6┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.14)
#### Step 5.14: Import login stylesheet

##### Changed scss/ionic.app.scss
```diff
@@ -23,3 +23,4 @@
 ┊23┊23┊
 ┊24┊24┊@import "chat";
 ┊25┊25┊@import "chats";
+┊  ┊26┊@import "login";
```
[}]: #

Up next, would be the confirmation view.

We will use `accounts` API again to verify the user and in case of successful authentication we will transition to the profile view. The same routine of implementation goes on.

Template:

[{]: <helper> (diff_step 5.15)
#### Step 5.15: Add confirmation view

##### Added www/templates/confirmation.html
```diff
@@ -0,0 +1,20 @@
+┊  ┊ 1┊<ion-view title="{{ confirmation.phone }}">
+┊  ┊ 2┊  <ion-nav-buttons side="right">
+┊  ┊ 3┊    <button ng-click="confirmation.confirm()" ng-disabled="!confirmation.code || confirmation.code.length === 0" class="button button-clear button-positive">Done</button>
+┊  ┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊
+┊  ┊ 6┊  <ion-content>
+┊  ┊ 7┊    <div class="text-center padding">
+┊  ┊ 8┊      We have sent you an SMS with a code to the number above
+┊  ┊ 9┊    </div>
+┊  ┊10┊    <div class="text-center padding">
+┊  ┊11┊      To complete your phone number verification WhatsApp, please enter the 4-digit activation code.
+┊  ┊12┊    </div>
+┊  ┊13┊
+┊  ┊14┊    <div class="list padding-top">
+┊  ┊15┊      <label class="item item-input">
+┊  ┊16┊        <input ng-model="confirmation.code" on-return="confirmation.confirm()" type="text" placeholder="Code">
+┊  ┊17┊      </label>
+┊  ┊18┊    </div>
+┊  ┊19┊  </ion-content>
+┊  ┊20┊</ion-view>🚫↵
```
[}]: #

Controller:

[{]: <helper> (diff_step 5.16)
#### Step 5.16: Add confirmation controller

##### Added src/controllers/confirmation.controller.js
```diff
@@ -0,0 +1,34 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Accounts } from 'meteor/accounts-base';
+┊  ┊ 3┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 4┊
+┊  ┊ 5┊export default class ConfirmationCtrl extends Controller {
+┊  ┊ 6┊  static $inject = ['$state', '$ionicPopup', '$log']
+┊  ┊ 7┊
+┊  ┊ 8┊  constructor() {
+┊  ┊ 9┊    super(...arguments);
+┊  ┊10┊
+┊  ┊11┊    this.phone = this.$state.params.phone;
+┊  ┊12┊  }
+┊  ┊13┊
+┊  ┊14┊  confirm() {
+┊  ┊15┊    if (_.isEmpty(this.code)) return;
+┊  ┊16┊
+┊  ┊17┊    Accounts.verifyPhone(this.phone, this.code, (err) => {
+┊  ┊18┊      if (err) return this.handleError(err);
+┊  ┊19┊      this.$state.go('profile');
+┊  ┊20┊    });
+┊  ┊21┊  }
+┊  ┊22┊
+┊  ┊23┊  handleError(err) {
+┊  ┊24┊    this.$log.error('Confirmation error ', err);
+┊  ┊25┊
+┊  ┊26┊    this.$ionicPopup.alert({
+┊  ┊27┊      title: err.reason || 'Confirmation failed',
+┊  ┊28┊      template: 'Please try again',
+┊  ┊29┊      okType: 'button-positive button-clear'
+┊  ┊30┊    });
+┊  ┊31┊  }
+┊  ┊32┊}
+┊  ┊33┊
+┊  ┊34┊ConfirmationCtrl.$name = 'ConfirmationCtrl';🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.17)
#### Step 5.17: Load confirmation controller

##### Changed src/app.js
```diff
@@ -6,6 +6,7 @@
 ┊ 6┊ 6┊
 ┊ 7┊ 7┊import ChatCtrl from './controllers/chat.controller';
 ┊ 8┊ 8┊import ChatsCtrl from './controllers/chats.controller';
+┊  ┊ 9┊import ConfirmationCtrl from './controllers/confirmation.controller';
 ┊ 9┊10┊import LoginCtrl from './controllers/login.controller';
 ┊10┊11┊import InputDirective from './directives/input.directive';
 ┊11┊12┊import CalendarFilter from './filters/calendar.filter';
```
```diff
@@ -23,6 +24,7 @@
 ┊23┊24┊new Loader(App)
 ┊24┊25┊  .load(ChatCtrl)
 ┊25┊26┊  .load(ChatsCtrl)
+┊  ┊27┊  .load(ConfirmationCtrl)
 ┊26┊28┊  .load(LoginCtrl)
 ┊27┊29┊  .load(InputDirective)
 ┊28┊30┊  .load(CalendarFilter)
```
[}]: #

And a route state:

[{]: <helper> (diff_step 5.18)
#### Step 5.18: Add confirmation route state

##### Changed src/routes.js
```diff
@@ -42,6 +42,11 @@
 ┊42┊42┊        url: '/login',
 ┊43┊43┊        templateUrl: 'templates/login.html',
 ┊44┊44┊        controller: 'LoginCtrl as logger'
+┊  ┊45┊      })
+┊  ┊46┊      .state('confirmation', {
+┊  ┊47┊        url: '/confirmation/:phone',
+┊  ┊48┊        templateUrl: 'templates/confirmation.html',
+┊  ┊49┊        controller: 'ConfirmationCtrl as confirmation'
 ┊45┊50┊      });
 ┊46┊51┊
 ┊47┊52┊    this.$urlRouterProvider.otherwise('tab/chats');
```
[}]: #

Let's proceed to the last view in the authentication flow. The `Profile` view provides the ability to enter the user's nickname and profile picture (Which, unfortunately, is not implemented in this tutorial yet).

Template:

[{]: <helper> (diff_step 5.19)
#### Step 5.19: Add profile view

##### Added www/templates/profile.html
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊<ion-view title="Profile">
+┊  ┊ 2┊  <ion-nav-buttons side="right">
+┊  ┊ 3┊    <button ng-click="profile.updateName()" ng-disabled="!profile.name || profile.name.length === 0" class="button button-clear button-positive">Done</button>
+┊  ┊ 4┊  </ion-nav-buttons>
+┊  ┊ 5┊
+┊  ┊ 6┊  <ion-content class="profile">
+┊  ┊ 7┊    <a class="profile-picture positive">
+┊  ┊ 8┊      <div class="upload-placehoder">
+┊  ┊ 9┊        Add photo
+┊  ┊10┊      </div>
+┊  ┊11┊    </a>
+┊  ┊12┊
+┊  ┊13┊    <div class="instructions">
+┊  ┊14┊      Enter your name and add an optional profile picture
+┊  ┊15┊    </div>
+┊  ┊16┊
+┊  ┊17┊    <div class="list profile-name">
+┊  ┊18┊      <label class="item item-input">
+┊  ┊19┊        <input ng-model="profile.name" on-return="profile.updateName()" type="text" placeholder="Your name">
+┊  ┊20┊      </label>
+┊  ┊21┊    </div>
+┊  ┊22┊  </ion-content>
+┊  ┊23┊</ion-view>🚫↵
```
[}]: #

Controller:

[{]: <helper> (diff_step 5.20)
#### Step 5.20: Add profile controller

##### Added src/controllers/profile.controller.js
```diff
@@ -0,0 +1,34 @@
+┊  ┊ 1┊import { _ } from 'meteor/underscore';
+┊  ┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class ProfileCtrl extends Controller {
+┊  ┊ 5┊  static $inject = ['$state', '$ionicPopup', '$log']
+┊  ┊ 6┊
+┊  ┊ 7┊  constructor() {
+┊  ┊ 8┊    super(...arguments);
+┊  ┊ 9┊
+┊  ┊10┊    const profile = this.currentUser && this.currentUser.profile;
+┊  ┊11┊    this.name = profile ? profile.name : '';
+┊  ┊12┊  }
+┊  ┊13┊
+┊  ┊14┊  updateName() {
+┊  ┊15┊    if (_.isEmpty(this.name)) return;
+┊  ┊16┊
+┊  ┊17┊    this.callMethod('updateName', this.name, (err) => {
+┊  ┊18┊      if (err) return this.handleError(err);
+┊  ┊19┊      this.$state.go('tab.chats');
+┊  ┊20┊    });
+┊  ┊21┊  }
+┊  ┊22┊
+┊  ┊23┊  handleError(err) {
+┊  ┊24┊    this.$log.error('Profile save error ', err);
+┊  ┊25┊
+┊  ┊26┊    this.$ionicPopup.alert({
+┊  ┊27┊      title: err.reason || 'Save failed',
+┊  ┊28┊      template: 'Please try again',
+┊  ┊29┊      okType: 'button-positive button-clear'
+┊  ┊30┊    });
+┊  ┊31┊  }
+┊  ┊32┊}
+┊  ┊33┊
+┊  ┊34┊ProfileCtrl.$name = 'ProfileCtrl';🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.21)
#### Step 5.21: Load profile controller

##### Changed src/app.js
```diff
@@ -8,6 +8,7 @@
 ┊ 8┊ 8┊import ChatsCtrl from './controllers/chats.controller';
 ┊ 9┊ 9┊import ConfirmationCtrl from './controllers/confirmation.controller';
 ┊10┊10┊import LoginCtrl from './controllers/login.controller';
+┊  ┊11┊import ProfileCtrl from './controllers/profile.controller';
 ┊11┊12┊import InputDirective from './directives/input.directive';
 ┊12┊13┊import CalendarFilter from './filters/calendar.filter';
 ┊13┊14┊import Routes from './routes';
```
```diff
@@ -26,6 +27,7 @@
 ┊26┊27┊  .load(ChatsCtrl)
 ┊27┊28┊  .load(ConfirmationCtrl)
 ┊28┊29┊  .load(LoginCtrl)
+┊  ┊30┊  .load(ProfileCtrl)
 ┊29┊31┊  .load(InputDirective)
 ┊30┊32┊  .load(CalendarFilter)
 ┊31┊33┊  .load(Routes);
```
[}]: #

Route state:

[{]: <helper> (diff_step 5.22)
#### Step 5.22: Add profile route state

##### Changed src/routes.js
```diff
@@ -47,6 +47,14 @@
 ┊47┊47┊        url: '/confirmation/:phone',
 ┊48┊48┊        templateUrl: 'templates/confirmation.html',
 ┊49┊49┊        controller: 'ConfirmationCtrl as confirmation'
+┊  ┊50┊      })
+┊  ┊51┊      .state('profile', {
+┊  ┊52┊        url: '/profile',
+┊  ┊53┊        templateUrl: 'templates/profile.html',
+┊  ┊54┊        controller: 'ProfileCtrl as profile',
+┊  ┊55┊        resolve: {
+┊  ┊56┊          user: this.isAuthorized
+┊  ┊57┊        }
 ┊50┊58┊      });
 ┊51┊59┊
 ┊52┊60┊    this.$urlRouterProvider.otherwise('tab/chats');
```
[}]: #

Style:

[{]: <helper> (diff_step 5.23)
#### Step 5.23: Add profile stylesheet

##### Added scss/profile.scss
```diff
@@ -0,0 +1,40 @@
+┊  ┊ 1┊.profile {
+┊  ┊ 2┊  padding-top: 20px;
+┊  ┊ 3┊
+┊  ┊ 4┊  .profile-picture {
+┊  ┊ 5┊    position: absolute;
+┊  ┊ 6┊    top: 0;
+┊  ┊ 7┊    left: 20px;
+┊  ┊ 8┊    text-align: center;
+┊  ┊ 9┊
+┊  ┊10┊    img {
+┊  ┊11┊      display: block;
+┊  ┊12┊      max-width: 50px;
+┊  ┊13┊      max-height: 50px;
+┊  ┊14┊      width: 100%;
+┊  ┊15┊      height: 100%;
+┊  ┊16┊      border-radius: 50%;
+┊  ┊17┊    }
+┊  ┊18┊
+┊  ┊19┊    .upload-placehoder {
+┊  ┊20┊      width: 50px;
+┊  ┊21┊      height: 50px;
+┊  ┊22┊      padding: 5px;
+┊  ┊23┊      border: 1px solid #808080;
+┊  ┊24┊      border-radius: 50%;
+┊  ┊25┊      line-height: 18px;
+┊  ┊26┊      font-size: 12px;
+┊  ┊27┊    }
+┊  ┊28┊  }
+┊  ┊29┊
+┊  ┊30┊  .instructions {
+┊  ┊31┊    min-height: 60px;
+┊  ┊32┊    padding: 10px 20px 20px 90px;
+┊  ┊33┊    font-size: 14px;
+┊  ┊34┊    color: gray;
+┊  ┊35┊  }
+┊  ┊36┊
+┊  ┊37┊  .profile-name {
+┊  ┊38┊    margin-top: 20px;
+┊  ┊39┊  }
+┊  ┊40┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.24)
#### Step 5.24: Import profile stylesheet

##### Changed scss/ionic.app.scss
```diff
@@ -24,3 +24,4 @@
 ┊24┊24┊@import "chat";
 ┊25┊25┊@import "chats";
 ┊26┊26┊@import "login";
+┊  ┊27┊@import "profile";
```
[}]: #

The authentication flow is complete. Now once we start our application for the first time this is what we should see:



If you will take a look at step 5.20, the `ProfileCtrl` uses a server method called `updateName` which is yet to be implemented. Let's implement it in our `api`:

[{]: <helper> (diff_step 5.25)
#### Step 5.25: Add update name method to api

##### Changed api/server/methods.js
```diff
@@ -15,5 +15,20 @@
 ┊15┊15┊    Chats.update(message.chatId, { $set: { lastMessage: message } });
 ┊16┊16┊
 ┊17┊17┊    return messageId;
+┊  ┊18┊  },
+┊  ┊19┊
+┊  ┊20┊  updateName(name) {
+┊  ┊21┊    if (!this.userId) {
+┊  ┊22┊      throw new Meteor.Error('not-logged-in',
+┊  ┊23┊        'Must be logged in to update his name.');
+┊  ┊24┊    }
+┊  ┊25┊
+┊  ┊26┊    check(name, String);
+┊  ┊27┊
+┊  ┊28┊    if (name.length === 0) {
+┊  ┊29┊      throw Meteor.Error('name-required', 'Must provide a user name');
+┊  ┊30┊    }
+┊  ┊31┊
+┊  ┊32┊    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
 ┊18┊33┊  }
 ┊19┊34┊});🚫↵
```
[}]: #

`Meteor` sets `this.userId` to contain some information about the current logged in user, so by checking for this variable's existence we know if there is a user logged in or not.

Now let's add this validation to the `newMessage()` method we've just created, and attach the user's id to each message he sends:

[{]: <helper> (diff_step 5.26)
#### Step 5.26: Bind users to new messages

##### Changed api/server/methods.js
```diff
@@ -4,12 +4,18 @@
 ┊ 4┊ 4┊
 ┊ 5┊ 5┊Meteor.methods({
 ┊ 6┊ 6┊  newMessage(message) {
+┊  ┊ 7┊    if (!this.userId) {
+┊  ┊ 8┊      throw new Meteor.Error('not-logged-in',
+┊  ┊ 9┊        'Must be logged in to send message.');
+┊  ┊10┊    }
+┊  ┊11┊
 ┊ 7┊12┊    check(message, {
 ┊ 8┊13┊      text: String,
 ┊ 9┊14┊      chatId: String
 ┊10┊15┊    });
 ┊11┊16┊
 ┊12┊17┊    message.timestamp = new Date();
+┊  ┊18┊    message.userId = this.userId;
 ┊13┊19┊
 ┊14┊20┊    const messageId = Messages.insert(message);
 ┊15┊21┊    Chats.update(message.chatId, { $set: { lastMessage: message } });
```
[}]: #

Great, now the last missing feature is logout. Let’s add the settings view which contains the logout button:

[{]: <helper> (diff_step 5.27)
#### Step 5.27: Add settings view

##### Added www/templates/settings.html
```diff
@@ -0,0 +1,8 @@
+┊ ┊1┊
+┊ ┊2┊<ion-view view-title="Settings">
+┊ ┊3┊  <ion-content>
+┊ ┊4┊    <div class="padding text-center">
+┊ ┊5┊      <button ng-click="settings.logout()" class="button button-clear button-assertive">Logout</button>
+┊ ┊6┊    </div>
+┊ ┊7┊  </ion-content>
+┊ ┊8┊</ion-view>🚫↵
```
[}]: #

Let's implement the `SettingsCtrl` containing the logic for logging out:

[{]: <helper> (diff_step 5.28)
#### Step 5.28: Add settings controller

##### Added src/controllers/settings.controller.js
```diff
@@ -0,0 +1,23 @@
+┊  ┊ 1┊import { Meteor } from 'meteor/meteor';
+┊  ┊ 2┊import { Controller } from 'angular-ecmascript/module-helpers';
+┊  ┊ 3┊
+┊  ┊ 4┊export default class SettingsCtrl extends Controller {
+┊  ┊ 5┊  static $inject = ['$state', '$ionicPopup', '$log']
+┊  ┊ 6┊
+┊  ┊ 7┊  logout() {
+┊  ┊ 8┊    Meteor.logout((err) => {
+┊  ┊ 9┊      if (err) return this.handleError(err);
+┊  ┊10┊      this.$state.go('login');
+┊  ┊11┊    })
+┊  ┊12┊  }
+┊  ┊13┊
+┊  ┊14┊  handleError (err) {
+┊  ┊15┊    this.$log.error('Settings modification error', err);
+┊  ┊16┊
+┊  ┊17┊    this.$ionicPopup.alert({
+┊  ┊18┊      title: err.reason || 'Settings modification failed',
+┊  ┊19┊      template: 'Please try again',
+┊  ┊20┊      okType: 'button-positive button-clear'
+┊  ┊21┊    });
+┊  ┊22┊  }
+┊  ┊23┊}🚫↵
```
[}]: #

[{]: <helper> (diff_step 5.29)
#### Step 5.29: Load settings controller

##### Changed src/app.js
```diff
@@ -9,6 +9,7 @@
 ┊ 9┊ 9┊import ConfirmationCtrl from './controllers/confirmation.controller';
 ┊10┊10┊import LoginCtrl from './controllers/login.controller';
 ┊11┊11┊import ProfileCtrl from './controllers/profile.controller';
+┊  ┊12┊import SettingsCtrl from './controllers/settings.controller';
 ┊12┊13┊import InputDirective from './directives/input.directive';
 ┊13┊14┊import CalendarFilter from './filters/calendar.filter';
 ┊14┊15┊import Routes from './routes';
```
```diff
@@ -28,6 +29,7 @@
 ┊28┊29┊  .load(ConfirmationCtrl)
 ┊29┊30┊  .load(LoginCtrl)
 ┊30┊31┊  .load(ProfileCtrl)
+┊  ┊32┊  .load(SettingsCtrl)
 ┊31┊33┊  .load(InputDirective)
 ┊32┊34┊  .load(CalendarFilter)
 ┊33┊35┊  .load(Routes);
```
[}]: #

And to make things work, we need to add the appropriate route state:

[{]: <helper> (diff_step 5.30)
#### Step 5.30: Add settings route state

##### Changed src/routes.js
```diff
@@ -38,6 +38,15 @@
 ┊38┊38┊          }
 ┊39┊39┊        }
 ┊40┊40┊      })
+┊  ┊41┊      .state('tab.settings', {
+┊  ┊42┊        url: '/settings',
+┊  ┊43┊        views: {
+┊  ┊44┊          'tab-settings': {
+┊  ┊45┊            templateUrl: 'templates/settings.html',
+┊  ┊46┊            controller: 'SettingsCtrl as settings',
+┊  ┊47┊          }
+┊  ┊48┊        }
+┊  ┊49┊      })
 ┊41┊50┊      .state('login', {
 ┊42┊51┊        url: '/login',
 ┊43┊52┊        templateUrl: 'templates/login.html',
```
[}]: #

And this is how our settings page should look like:

Now that we have our user id bounded to each message, we can determine the real ownership of each message. So, let's update our chat view accordingly:

[{]: <helper> (diff_step 5.31)
#### Step 5.31: Add ownership to incomming messages in chat view

##### Changed www/templates/chat.html
```diff
@@ -6,7 +6,7 @@
 ┊ 6┊ 6┊  <ion-content class="chat" delegate-handle="chatScroll">
 ┊ 7┊ 7┊    <div class="message-list">
 ┊ 8┊ 8┊      <div ng-repeat="message in chat.messages" class="message-wrapper">
-┊ 9┊  ┊        <div class="message" ng-class-even="'message-mine'" ng-class-odd="'message-other'">
+┊  ┊ 9┊        <div class="message" ng-class="message.userId === $root.currentUser._id ? 'message-mine' : 'message-other'">
 ┊10┊10┊          <div class="message-text">{{ message.text }}</div>
 ┊11┊11┊          <span class="message-timestamp">{{ message.timestamp | amDateFormat: 'HH:MM' }}</span>
 ┊12┊12┊        </div>
```
[}]: #

Great! Everything works well now, but let's take our chatting experience one step further. Let's add an auto-scrolling feature, so our conversation would look more fluent and we won't have to scroll down any time our chat space is full:

[{]: <helper> (diff_step 5.32)
#### Step 5.32: Add auto scroll to chat

##### Changed src/controllers/chat.controller.js
```diff
@@ -21,6 +21,8 @@
 ┊21┊21┊        return Chats.findOne(this.chatId);
 ┊22┊22┊      }
 ┊23┊23┊    });
+┊  ┊24┊
+┊  ┊25┊    this.autoScrollBottom();
 ┊24┊26┊  }
 ┊25┊27┊
 ┊26┊28┊  sendMessage() {
```
```diff
@@ -56,6 +58,17 @@
 ┊56┊58┊    }
 ┊57┊59┊  }
 ┊58┊60┊
+┊  ┊61┊  autoScrollBottom() {
+┊  ┊62┊    let recentMessagesNum = this.messages.length;
+┊  ┊63┊
+┊  ┊64┊    this.autorun(() => {
+┊  ┊65┊      const currMessagesNum = this.getCollectionReactively('messages').length;
+┊  ┊66┊      const animate = recentMessagesNum != currMessagesNum;
+┊  ┊67┊      recentMessagesNum = currMessagesNum;
+┊  ┊68┊      this.scrollBottom(animate);
+┊  ┊69┊    });
+┊  ┊70┊  }
+┊  ┊71┊
 ┊59┊72┊  scrollBottom(animate) {
 ┊60┊73┊    this.$timeout(() => {
 ┊61┊74┊      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
```
[}]: #
[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step4.md) | [Next Step >](step6.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #