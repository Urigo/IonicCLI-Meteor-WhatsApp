Right now all the chats are published to all the clients which is not very safe for privacy. Let's fix that.

First thing we need to do inorder to stop all the automatic publication of information is to remove the `autopublish` package from the `Meteor` server. Type in the command line:

    $ meteor remove autopublish

We will add now the [publish-composite](https://atmospherejs.com/reywood/publish-composite) package which will help us implement joined collection pubications.

    $ meteor add reywood:publish-composite

Now we need to explicitly define our publications. Let's start by sending the users' information.

Create a file named `publications.js` under the `api/server` with the following contents:

{{{diff_step 6.3}}}

For the `users` collection we only defined a query for publication, and for the `chats` we defined a composite publication where each user will get his relevant chats.

And of course we need to modify some of the client side code, we need to make sure that the client is subscribed to the published data, so let's do so in `NewChatCtrl`, because this is where we need the `users` data:

{{{diff_step 6.4}}}

Now we will add a subscription to the `chats` data in the client:

{{{diff_step 6.5}}}
