[{]: <region> (header)
# Step 0: Bootstrapping
[}]: #
[{]: <region> (body)
Both `Meteor` and `Ionic` took their platform to the next level in tooling.
Both provide CLI interface instead of bringing bunch of dependencies and configure build tools.
There is also differences between those tools, in this post we will focus on the `Ionic` CLI.

To start, let’s install `Ionic` with Npm. In your command line:

    $ npm install -g ionic

Now let’s create a new `Ionic` app with the tabs template:

    $ ionic start whatsapp tabs

Now inside the app’s folder, run:

    $ npm install
    $ bower install

Let’s run this default app, in the command line:

    $ ionic serve

to run inside browser, or:

    $ ionic emulate

to run inside a simulator.

It is also recommended to exclude the `libs` dir from git so irrelevant content won't be uploaded to github as we make progress with this tutorial. Just edit the `.gitignore` file like so:

[{]: <helper> (diff_step 0.1)
#### Step 0.1: Added missing gitignore file

##### Changed .gitignore
```diff
@@ -5,3 +5,4 @@
 ┊5┊5┊platforms/
 ┊6┊6┊plugins/
 ┊7┊7┊.idea
+┊ ┊8┊www/lib/
```
[}]: #

[}]: #
[{]: <region> (footer)
[{]: <helper> (nav_step)
| [< Previous Step](step-1.md) | [Next Step >](step1.md) |
|:--------------------------------|--------------------------------:|
[}]: #
[}]: #