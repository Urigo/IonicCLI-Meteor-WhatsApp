Now that we've finished making our initial setup, let's dive into the code of our app.

First, we will need some helpers which will help us write some `AngularJS` code using es6's class system. For this purpose we will use [angular-ecmascript](https://github.com/DAB0mB/angular-ecmascript) npm package. Let's install it:

    $ npm install angular-ecmascript --save

`angular-ecmascript` is a utility library which will help us write an `AngularJS` app using es6's class system. In addition, `angular-ecmascript` provides us with some very handy features, like auto-injection without using any pre-processors like [ng-annotate](https://github.com/olov/ng-annotate), or setting our controller as the view model any time it is created (See [referene](/api/1.3.11/reactive)). The API shouldn't be too complicated to understand, and we will get familiar with it as we make progress with this tutorial.

> *NOTE*: As for now there is no best pratice for writing `AngularJS` es6 code, this is one method we recommend out of many possible other options.

Now that everything is set, let's create the `RoutesConfig` using the `Config` module-helper:

{{{diff_step 2.2}}}

This will be our main app router which is implemented using [angular-ui-router](https://atmospherejs.com/angularui/angular-ui-router), and anytime we would like to add some new routes and configure them, this is where we do so.

After we define a helper, we shall always load it in the main app file. Let's do so:

{{{diff_step 2.3}}}

As you can see there is only one route state defined as for now, called `tabs`, which is connected to the `tabs` view. Let's add it:

{{{diff_step 2.4}}}

In our app we will have 5 tabs: `Favorites`, `Recents`, `Contacts`, `Chats`, and `Settings`. In this tutorial we will only focus on implementing the `Chats` and the `Settings` tabs, but your'e more than free to continue on with this tutorial and implement the rest of the tabs.

Let's create `Chats` view which will appear one we click on the `Chats` tab. But first, let's install an npm package called `Moment` which is a utility library for manipulating date object. It will soon come in handy:

    $ npm install moment --save

Our `package.json` should look like so:

{{{diff_step 2.5}}}

Now that we have installed `Moment`, we need to expose it to our environment, since some libraries we load which are not using es6's module system rely on it being defined as a global variable. For these purposes we shall use the `expose-loader`. Simply, add to our `index.js` file:

{{{diff_step 2.6}}}

After the `?` comes the variable name which shuold be defined on the global scope, and after the `!` comes the library we would like to load. In this case we load the `Moment` library and we would like to expose it as `window.global`.

> *NOTE*: Altough `Moment` is defined on the global scope, we will keep importing it in every module we wanna use it, since it's more declerative and clearer.

Now that we have `Moment` lock and loaded, we will create our `Chats` controller and we will use it to create some data stubs:

{{{diff_step 2.7}}}

And we will load it:

{{{diff_step 2.8}}}

> *NOTE*: From now on any component we create we will also load it right after, without any further explenations.

The data stubs are just a temporary fabricated data which will be used to test our application and how it reacts with it. You can also look at our scheme and figure out how our application is gonna look like.

Now that we have the controller with the data, we need a view to present it. We will use `ion-list` and `ion-item` directives, which provides us a list layout, and we will iterate our static data using `ng-repeat` and we will display the chat's name, image and timestamp.

Let's create it:

{{{diff_step 2.9}}}

We also need to define the appropriate route state which will be navigated any time we press the `Chats` tab. Let's do so:

{{{diff_step 2.10}}}

If you look closely we used the `controllerAs` syntax, which means that our data models should be stored on the controller and not on the scope.

We also used the `$urlRouterProvider.otherwise()` which defines our `Chats` state as the default one, so any unrecognized route state we navigate to our router will automatically redirect us to this state.

As for now, our chats' dates are presented in a very messy format which is not very informative for the every-day user. We wanna present it in a calendar format. Inorder to do that we need to define a `Filter`, which is provided by `Angular` and responsibe for projecting our data presented in the view. Let's add the `CalendarFilter`:

{{{diff_step 2.11}}}

{{{diff_step 2.12}}}

And now let's apply it to the view:

{{{diff_step 2.13}}}

As you can see, inorder to apply a filter in the view we simply pipe it next to our data model.

We would also like to be able to remove a chat, let's add a delete button for each chat:

{{{diff_step 2.14}}}

And implement its logic in the controller:

{{{diff_step 2.15}}}

Now everything is ready, but it looks a bit dull. Let's add some style to it:

{{{diff_step 2.16}}}

Since the stylesheet was written in `SASS`, we need to import it into our main `scss` file:

{{{diff_step 2.17}}}

> *NOTE*: From now on every `scss` file we write will be imported right after without any further explenations.

Our `Chats` tab is now ready. You can run it inside a browser, or if you prefer to see it in a mobile layout, you should use `Ionic`'s simulator. Just follow the following instructions:

    $ npm install -g ios-sim
    $ cordova platform add i The API shouldn't be too complicated to understand, and we will get familiar with it as we make progress with this tutorial.

{{tutorialImage 'ionic' '1.png' 500}}

And if you swipe a menu item to the left:

{{tutorialImage 'ionic' '2.png' 400}}
