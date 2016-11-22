In this tutorial we will write our app using `ecmascript6` javascript, which is the latest version of javascript updated with the new ecmascript standards (From now on we will refer it as 'es6'). So before we dive into building our app, we need to make an initial setup inorder to achieve that.

Iorder to write some es6 code we will need a pre-processor. [babel](https://babeljs.io/) plays a perfect roll for that. But that's not all. One of the most powerful tools in es6 is the module system. It uses relative paths inorder to load different modules we implement. `babel` can't do that alone because it can't load relative modules using sytax only. We will need some sort of a module bundler.

That's where [Webpack](https://webpack.github.io/) kicks in. `Webpack` is just a module bundler, but it can also use pre-processors on the way and it can be easily configured by whatever rules we specify, and is a very powerful tool and is being used very commonly.

`Meteor` also uses the same techniques to implement es6, and load `npm` modules into client side code, but since we're using `Ionic` cli and not `Meteor`, we will implement our own `Webpack` configuration, using our own rules!

Great, now that we have the idea of what `Webpack` is all about, let's setup our initial config:

{{{diff_step 1.1}}}

> *NOTE*: Since we don't want to digress from this tutorial's subject, we won't go into details about `Webpack`'s config. For more information, see [reference](https://webpack.github.io/docs/configuration.html).

We would also like to initiate `Webpack` once we build our app. All our tasks are defined in one file called `gulpfile.js`, which uses [gulp](http://gulpjs.com/)'s API to perform and chain them.

Let's edit our `gulpfile.js` accordingly:

{{{diff_step 1.2}}}

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

{{{diff_step 1.3}}}

`Ionic` provides us with a very nice skelton for building our app. But we would like to use a different method which is a little more advanced which will help us write some es6 code properly.

Thus, we shall clean up some files from our project, just run:

    $ cd ./www
    $ rm -rf ./css
    $ rm -rf ./img
    $ rm -rf ./js
    $ rm -rf ./templates

Next, we will setup our `index.html`:

{{{diff_step 1.5}}}

- We named our app `Whatsapp`, since that's what it represents.
- We removed all css files accept for one, since they are all pre-processed and imported using a library called [SASS](http://sass-lang.com/) into one file called `ionic.app.css`. All our scss files should be defined in `scss` folder.
- Same goes for javascript files, they will all be bundled into one file called `app.bundle.js` using our `Webpack` config we've just defined.
- We removed the `ng-app` attribute which will then take place in our javascript code.

Now that we have an initial setup, let's define our entry point for our code. Create a file called `index.js` in our `src` folder with the following contents:

{{{diff_step 1.6}}}

This is simply a file where all our desired scripts are loaded. Note that libraries are being loaded with the `script!` pre-fix, which is braught to us by the `script-loader` npm package. This pre-fix is called a loader, and we actually have many types of it, but in this case it tells `Webpack` that the files specified afterwards should be loaded as-is, without handling any module requirements or any pre-processors.

> *NOTE*: We can also specify the script loader as a general rule for all our libraries, but this way it won't be clear that the files we just imported are being imported as scripts. Both approaches are good, but we will stick with the direct and simple approach of specifying the script loader for every library module imported, because it's more declerative.

As you can see there is also an `app.js` file being imported at the bottom. This file should be our main app file. Let's write it:

{{{diff_step 1.7}}}

As you can see, we define our app's module and we bootstrap it. Bootstraping is when we initialize primary logic in our application, and is done automatically by `Angular`. Ofcourse, there is some additional code related to `cordova` enviroment, like hiding the keyboard on startup.

We'de now like to build our app and watch for file changes as we run our app. To do so, just edit the `ionic.project` file and add `Gulp` files to run on startup.

{{{diff_step 1.8}}}

Also, since we use pre-processors for both our `.js` and `.css` files, they are not relevant anymore. Let's make sure they won't be included in our next commits by adding them to the `.gitignore` file:

{{{diff_step 1.9}}}
