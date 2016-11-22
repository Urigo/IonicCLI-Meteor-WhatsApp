In this step we will add the chat view and the ability to send messages.

We still don’t have an identity for each user, we will add it later, but we can still send messages to existing chats.

So just like any other page, let’s begin by adding a very basic view with the chat's details:

{{{diff_step 4.1}}}

Now we need to implement the logic in the controller, so let’s create it:

{{{diff_step 4.2}}}

{{{diff_step 4.3}}}

We used the `$statePrams` provider to get the id of the chat, and then we used the `Chats` collection to find the data related to the it. The function `findOne()` takes a query as a parameter and returns a single document. Just like collections in `MongoDB`.

Now that we have the view and the controller let's connect them by adding the appropriate route state:

{{{diff_step 4.4}}}

And all is left to do is to link these two:

{{{diff_step 4.5}}}

Now each time we will click on a chat item from the menu, we should be navigating to it.

Let’s create a new `scss` file to our `Chat` and fix the image style so it won't look silly:

{{{diff_step 4.6}}}

{{{diff_step 4.7}}}

Our next step is about getting the chat messages on the controller, we will add another helper, but instead of using the whole collection we will fetch only the relevant messages for the current chat:

{{{diff_step 4.8}}}

And now to add it to the view, we use `ng-repeat` to iterate the messages:

{{{diff_step 4.9}}}

Now that it is well functioning, let's polish our `Chats`'s looking by adding some style to our newly created messages:

{{{diff_step 4.10}}}

Also, this stylesheet uses some assets located in the `www/img` dir, so inorder for the stylesheet to work properly you'll need to copy the files located [here](https://github.com/Urigo/IonicCLI-Meteor-WhatsApp/tree/master/www/img).

After doing so, our app should look like this:

{{tutorialImage 'ionic' '4.png' 500}}

Now we just need to take care of the message timestamp and format it.

We will use `Moment` like before, but now let's add another package called [angular-moment](https://github.com/urish/angular-moment) that provides us the UI filters.

So adding the package is just like any other package we added so far. First, we will install it:

    $ npm install angular-moment --save

{{{diff_step 4.12}}}

And then we will load it:

{{{diff_step 4.13}}}

{{{diff_step 4.14}}}

> *NOTE*: Because it’s an `Angular` extension, we loaded its dependency in our module definition.

Now that we have `angular-moment` ready to use, we will use a filter provided by it in our view:

{{{diff_step 4.15}}}

Our messages are set, but there is one really important feature missing and that's sending messages. Let's implement our message editor.

We will start with the view itself. We will add an input for editing our messages, a `send` button and some icons for sending images and sound recordings, whom logic won't be implemented in this tutorial since we only wanna focus on the messaging system.

The `ionic-footer-bar` directive provides a perfect solution for placing stuff under our content, let's use it:

{{{diff_step 4.16}}}

To improve the user experience in our app, we want some extra events to our input because we want to move it up when the keyboard comes from the bottom of the screen and we want to know if `return` (aka `Enter`) was pressed.

We will implement a new directive that extends the regular `input` tag and add those events to the directive:

{{{diff_step 4.17}}}

{{{diff_step 4.18}}}

And now we can use those events in our view:

{{{diff_step 4.19}}}

And implement the controller methods which handle those events:

{{{diff_step 4.20}}}

We will also add some `css` to this view:

{{{diff_step 4.21}}}

So now when the user focuses on the input, it should pop up.

This is what we got so far:

{{tutorialImage 'ionic' '5.png' 500}}

So now it’s time to implement the `sendMessage()` in our controller, which is responsible for the logic of sending a message.

We will use `Scope.callMethod()` in order to call that method on the server side:

{{{diff_step 4.22}}}

Now let’s create our `api` method in a file called `methods.js`:

{{{diff_step 4.23}}}

And we also need to load them in our client, since they are called twice, once in our client (As a validation and smoother experience without refreshing) and once in our server (For security and data handling):

{{{diff_step 4.24}}}

We would also like to validate some data sent to methods we define. `Meteor` provides us with a useful package named `check` that validates data types and scheme.

We will add it to our server using the following commands:

    $ cd api
    $ meteor add check

> *NOTE*: `meteor-client-side` is already provided with the `check` package so no need to require it again.

Now let’s use it in the `newMessage()` method:

{{{diff_step 4.26}}}

Now that it's ready you can go ahead and send a message and view it on the screen. It should look like this:
