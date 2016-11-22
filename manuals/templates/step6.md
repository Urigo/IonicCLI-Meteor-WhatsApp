Our next step is about adding the ability to create new chats. So far we had the chats list and the users feature, we just need to connect them.

We will open the new chat view using `Ionic`'s modal dialog, so first let's add a button that opens this dialog to the chats list:

{{{diff_step 6.1}}}

This button calls a controller method, which we will implement now in the controller:

{{{diff_step 6.2}}}

Note that we first create the modal dialog with a template, and then later we open it in the button function.

Inorder to open this modal, we will create a service that takes care of that:

{{{diff_step 6.3}}}

{{{diff_step 6.4}}}

Now let's add the view of this modal dialog, which is just a list of users:

{{{diff_step 6.5}}}

And now we will add the controller of this view, and use the `NewChat` service:

{{{diff_step 6.6}}}

{{{diff_step 6.7}}}

The controller includes a server method for creating a chat which is not yet implemented, so let's create it:

{{{diff_step 6.8}}}

We will also rewrite the logic of `removeChat()` function in the `ChatsCtrl` and we will call a server method instead (which we will explain why further in this tutorial):

{{{diff_step 6.9}}}

And we will implement the method on the server:

{{{diff_step 6.10}}}

The next messages won't include the username, only the user id, so we need to change the logic of username display. We will add a filter that fetches the user object from the `Users` collection according to the `userId` property of the chat object:

{{{diff_step 6.11}}}

And we will also create the same logic for fetching the user's image:

{{{diff_step 6.12}}}

And we will load our filters:

{{{diff_step 6.13}}}

And we will add the usage of these filters in the chats list view:

{{{diff_step 6.14}}}

And in the chat view:

{{{diff_step 6.15}}}

Now we want to get rid of the current data we have, which is just a static data.

So let's stop our `Meteor`'s server and reset the whole app by running:

    $ meteor reset

Let's add some users to the server instead of the old static data:

{{{diff_step 6.16}}}

Run it again.

Cool! Now once we click a user a new chat should be created with it.

Our last part of this step is to remove `Meteor`'s package named `insecure`.

This package provides the ability to run `remove()` method from the client side in our collection. This is a behavior we do not want to use because removing data and creating data should be done in the server and only after certain validations, and this is the reason for implementing the `removeChat()` method in the server.

`Meteor` includes this package only for development purposes and it should be removed once our app is ready for production.

So remote this package by running this command:

    $ meteor remove insecure