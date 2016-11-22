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

{{{diff_step 3.3}}}

Now we are ready to write some server code.

Let’s define two data collections, one for our `Chats` and one for their `Messages`.

We will define them inside a dir called `server` in the `api`, since code written under this dir will be bundled only for server side by `Meteor`'s build system. We have no control of it and therefore we can't change this layout. This is one of `Meteor`'s disadvantages, that it's not configurable, so we will have to fit ourselves into this build strategy.

Let's go ahead and create the `collections.js` file:

{{{diff_step 3.4}}}

Now we will update our `webpack.config.js` to handle some server logic:

{{{diff_step 3.5}}}

We simply added an alias for the `api/server` folder and a custom handler for resolving `Meteor` packages. This gives us the effect of combining client side code with server side code, something that is already built-in in `Meteor`'s cli, only this time we created it.

Now that the server side is connected to the client side, we will also need to watch for changes over there and re-build our client code accordingly.

To do so, we will have to update the watched paths in the `gulpfile.js`:

{{{diff_step 3.6}}}

Let’s bring `Meteor`'s powerful client side tools that will help us easily sync to the `Meteor` server in real time.

Navigate the command line into your project’s root folder and type:

    $ npm install meteor-client-side --save
    $ npm install angular-meteor --save

Notice that we also installed `angular-meteor` package which will help us bring `Meteor`'s benefits into an `Angular` project.

Our `package.json` should look like so:

{{{diff_step 3.7}}}

Don't forget to import the packages we've just installed in the `index.js` file:

{{{diff_step 3.8}}}

We will also need to load `angular-meteor` into our app as a module dependency, since that's how `Angular`'s module system works:

{{{diff_step 3.9}}}

Now instead of mocking a static data in the controller, we can mock it in the server.

Create a file named `bootstrap.js` inside the `api/server` dir and place the following initialization code inside:

{{{diff_step 3.10}}}

The code is pretty easy and self explanatory.

Let’s bind the collections to our `ChatsCtrl`.

We will use `Scope.helpers()`, each key will be available on the template and will be updated when it changes. Read more about helpers in our [API](http://www.angular-meteor.com/api/helpers).

{{{diff_step 3.11}}}

> *NOTE*: These are exactly the same collections as the server's. Adding `meteor-client-side` to our project has created a `Minimongo` on our client side. `Minimongo` is a client side cache with exactly the same API as [Mongo](https://www.mongodb.org/)'s API. `Minimongo` will take care of syncing the data automatically with the server.

> *NOTE*: `meteor-client-side` will try to connect to `localhost:3000` by default. To change it, simply set a global object named `__meteor_runtime_config__` with a property called `DDP_DEFAULT_CONNECTION_URL` and set whatever server url you'd like to connect to.

> *TIP*: You can have a static separate front end app that works with a `Meteor` server. you can use `Meteor` as a back end server to any front end app without changing anything in your app structure or build process.

Now our app with all its clients is synced with our server in real time!

To test it, you can open another browser, or another window in incognito mode, open another client side by side and delete a chat (by swiping the chat to the left and clicking `delete`).

See the chat is being deleted and updated in all the connected client in real time!

{{tutorialImage 'ionic' '3.png' 500}}
