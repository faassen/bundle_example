Bundling Toolchain Example
==========================

Introduction
------------

This project is an example of how you can bundle JavaScript code ready
for the web. We'll also detail some useful tools you can use along the
way.

A lot of other examples exist. Many examples use a tool like grunt or
gulp and quite a bit of custom JavaScript. We aim to avoid this. We
want power but stay minimalistic as possible and aim for declarative
configuration.

So to get started, clone this Github repo and follow along.

Why bundling?
-------------

Why do we need a bundling tool at all? It's because we want to
use JavaScript like we do other programming languages. In many
modern programming languages we have:

* A way to import a module into another so we can use its API. The
  module may be from the same project or come from an external
  package. The `import` statement in Python and Haskell, `use` (or
  `require`) in Perl, `require` in Ruby, etc.

* A package registry of useful reusable code. CPAN for Perl, Python's
  PyPI, Ruby's RubyGems, Hackage for Haskell, etc.

* A tool to install such packages for a project. Python's `pip`, Ruby's
  `gem`, `cabal` for Haskell, etc.

* A way to specify basic metadata about your package, like its name,
  and author your package has, and most important, what other packages
  it depends on so they can be installed automatically too. Python's
  `setup.py`, Ruby's `.gemspec` files, etc.

JavaScript has such a system as well:

* The ES6 import statement to import a module into another: `import
  foo from 'bar'`.

* The http://npmjs.org package registry with reusable code.

* A tool to install such packages for a project: `npm`.

* A way to specify metadata about your package: `package.json`.

If you're writing server JavaScript, that's it, but JavaScript has a
problem most of these languages don't have: it can also run inside a
web browser.

In even a medium-sized application you can easily end up using
hundreds of modules. You don't write all of those modules yourself,
but your dependencies have modules too, which in turn may import from
other modules, and so on.

Web browsers don't have a standard way yet to load modules. They also
don't like loading up hundreds of small files -- something that would
happen if you loaded modules individually. It gets very slow fast, at
least until HTTP2 is widely deployed. It's much faster to load one or
a few large files.

That's we use tools to bundle modules into larger files we can then
easily include on a web page using a `<script>` tag: bundles.

Node
----

To use a bundling toolchain at all you first need a working
[Node](https://nodejs.org) environment. So go ahead and install it
if you haven't already.

Node is a way to run JavaScript code outside of a web browser, as a
general programming language. Many tools for managing JavaScript are
written using Node, so we're going to need it.

The Node version I use at the time of writing is:

```ShellSession
$ node --version
v4.2.1
```

npm
---

We already discussed [npm](https://docs.npmjs.com/), the package
manager for Node. It's automatically installed along with Node. We're
going to use it a lot.

`npm` can install packages locally in a `node_modules` in a project
directory. We'll use that later when we start bundling code for the
web. But for the toolchain it is convenient to install some tools
globally so they're easy to access on the command line.

You install tools globally by passing the `-g` option to npm. We'll
see an example of that later. Your operating system may however not
let you install this stuff unless you're the superuser, which is not
very nice. If you're in that situation, I recommend you configure
`npm` so that it installs global packages [in a directory under your home
directory](https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-2-change-npm-s-default-directory-to-another-directory)
first.

The version of npm that ships with Node at the time of writing is
still npm v2. npm v3 has features that help with bundling for the
web. npm v3 is at the time of writing still in a late beta, but it
should eventually ship by default with node v5. You can check the
version of your npm installation using this command:

```ShellSession
$ npm --version
v3.3.8
```

If you have npm v2 and you want to upgrade it to npm v3, or you just
want to upgrade npm to the latest version anyway, you can use this
command:

```ShellSession
$ npm install npm@latest -g
```

Using npm to install project dependencies
-----------------------------------------

So we have a JavaScript project and it has some dependencies. We can
declare these dependencies in our project's `package.json`. We can
also use `package.json` to drive some convenient tools later.

First we need to create a `package.json`. The example project already
has one -- take a look at it. If you need one you can use the `npm
init` command to create a new one for you.

A project specifies its dependencies in its `package.json` in its
`dependencies` section. This way it's very easy to install the project
in a known-working state. You install a project's dependencies using
the `npm install` command. Try it in `bundle_example` project
directory:

```ShellSession
$ npm install
```

The installed dependencies end up in `node_modules`. We shouldn't
check this into our version control system. Since we use git, we've
included a `.gitignore` that makes git ignore it.

Our `package.json` includes some dependencies already, which we've
now installed:

```JSON
"bootstrap": "^3.3.5",
"jquery": "^2.1.4"
```

We've picked two popular libraries, but that's just an example, not a
recommendation. The registry at http://www.npmjs.com contains
thousands of them. Some of these are only usable on the server, but
many of them can be used on the web.

Babel
-----

The JavaScript language has recently seen an update called ES6 (aka
ES2015) which adds [many useful
features](https://babeljs.io/docs/learn-es2015/). We need ES6. It
has a lot of useful stuff, but we especially need its `import` statement.

The developers of the various web browser are working on implementing
the ES6 features natively. If you're curious, this [compatibility
table](https://kangax.github.io/compat-table/es6/) gives you an
overview of what is supported today. Until browsers support ES6 we can
use a compiler like Babel to use these features already.

Besides ES6, Babel also supports experimental features that may end up
in an even newer version of JavaScript eventually. We won't worry
about them here. In additionan Babel supports compiler extensions that
lets framework developers extend the JavaScript language even further.

A global installation of babel is not strictly necessary to run this
example, but it's useful to have in any case so we're going to do it
anyway:

```ShellSession
$ npm install -g babel
```

You now have some new command-line tools available. `babel` is a tool
that lets you compile ES6 code manually: it takes in ES6 JavaScript
and outputs compatible JavaScript. We're going to automate Babel so
won't be using this tool, but you can use if you're curious about what
Babel actually does.

`babel-node` is more useful for our purposes. It can be used as a
replacement for the `node` command-line to run scripts that use ES6
features:

```ShellSession
$ babel-node myscript.js
```

You can also try out ES6 features on the command prompt. Here we use
arrow (`=>`) functions:

```ShellSession
$ babel-node
> (a => a + a)(3)
6
```

Babel can be configured using the `.babelrc` configuration file in your
project. Ours is very simple:

```JSON
{
  "stage": 2
}
```

We could in fact entirely omit it, as stage 2 is the default for
Babel.  This enables ES6 and a [few well-established draft
proposals](https://babeljs.io/docs/usage/experimental/) for the next
version of JavaScript. If you want to play it safe you could increase
the stage all the way up to 4 -- Babel will only allow official ES6
and nothing more.

Getting Started with Bundling
-----------------------------

Now we need to install a bundling tool. We use
[Webpack](https://webpack.github.io/):

```ShellSession
$ npm install -g webpack
```

Besides this Webpack *also* needs to be installed for your project as
a development dependency -- the Webpack configuration files needs to
be able to import from it. But since it's in `devDependencies` in
`package.json` this should have happened already when you did `npm
install`.

Before we go into the details of how things work, let's try Webpack out:

```ShellSession
$ webpack
```

This creates a `bundle.js` file and places it in the `public`
directory. The `public` directory contains a simple HTML file that
loads the bundle. It looks like this:

```HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bundle Example</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

You can serve the contents of `public` with any web server. For example,
you can use Python's built-in web server:

```ShellSession
$ python -m SimpleHTTPServer
```

But let's not do that and move on to `webpack-dev-server`.

webpack-dev-server
------------------

The most convenient server for development purposes is
[webpack-dev-server](
https://webpack.github.io/docs/webpack-dev-server.html). Let's show
what it can do. First we need to install it:

```ShellSession
$ npm install -g webpack-dev-server
```

Now we can use it. From the project directory, run the following command:

```ShellSession
$ webpack-dev-server --inline --content-base public/
```

You can now to go [http://localhost:8080](http://localhost:8080). You
should see an "Ok" checkmark image in a button that doesn't do
anything. What an absolutely spectacular application!

So what does `webpack-dev-server` do?

* It serves the files in `public`. You can access `index.html` through
  [http://localhost:8080](http://localhost:8080), which in turn loads
  `bundle.js`.

* When you change a source file in your project, `webpack-dev-server`
  automatically detects it and rebuilds the bundle for you right away.

* With the `--inline` flag `webpack-dev-server` automatically communicates
  any changes to the bundle and reloads it, immediately refreshing your
  web page.

The source
----------

Let's look at the JavaScript source code to see what it does and try
it out.  The source is in the `src` directory in the project. There
are two files: `index.js` and `a.js`.

`a.js` reads like this:

```javascript
import $ from 'jquery';

export function addButton(el) {
  el.append($(`<button type="button" class="btn btn-default">
                 <span class="glyphicon glyphicon-ok-sign"></span>
               </button>`));
}
```

This imports `$` from `jquery` using ES6. We then define a function
`addButton`. Using the `export` statement we make it available for
import by other modules -- we'll see this used by `index.js` in a bit.

The function itself is some simple jQuery code that adds a button that
uses Bootstrap 3 classes to show a checkmark glyph icon.

Now we move on to `index.js`:

```javascript
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import {addButton} from './a.js';

$(document).ready(() => {
  addButton($('#root'));
});
```

Here we see three import statements. First we import `$` again from
`jquery` as we use it in this module. Then we import some Bootstrap CSS
from the `bootstrap` package we have installed. This causes this
stylesheet to be included in the bundle. Finally we import `addButton`
from `a.js`.

Note that the curly brace (`{}`) syntax lets us import individual
names from a module, whereas without curly braces we import the object
the module exports entirely; we do this with `$` from `jquery`. You
need to know how the module exports things to do the right thing, and
this is a bit of a pitfall, as if the import fails it just returns
`undefined` instead. Try putting in a `console.log(foo)` in the
top-level code if you expect something went wrong with the import of
`foo`.

Next we have some simple jQuery code that, when the DOM is ready, uses
`addButton` to add the button to the element with id `root` in our
HTML page.

All this is a useless application, but does demonstrate that:

* We can load code and styles from external dependencies we've listed in
  `dependencies` in `package.json` and installed using `npm install`.

* We can load from other modules in the same directory with the
  `./`. You can use any path expression in there to load modules from
  subdirectories (`foo/bar.js`) or base directories `../bar.js`.

Webpack understands all this and includes what's needed in your
bundle.

Oh, and if you change anything to the code above, for instance change
the glyphicon to `glyphicon-ok-circle` and then save it, the bundle
gets recreated right away and the UI updates, thanks to
`webpack-dev-server`.

Webpack configuration
---------------------

Let's look at how Webpack is configured.

Webpack needs various loaders to understand how to include files of
particular types. These need to be installed as part of our `devDependencies`
in `package.json`. We've done this already so they are already installed:

```JSON
"devDependencies": {
  "babel-loader": "^5.3.2",
  "css-loader": "^0.21.0",
  "file-loader": "^0.8.4",
  "style-loader": "^0.13.0",
  "url-loader": "^0.5.6",
  "webpack": "^1.12.2"
}
```

Let's go through these:

* `babel-loader` is to load ES6 JavaScript files.

* `style-loader` is to load stylesheets.

* `css-loader` is to load things the stylesheet depends on with `@import` and
  `url(...)`.

* `file-loader` can be used to load resources (such as images and
  fonts) as separate files.

* `url-loader` is like a `file-loader` but can automatically embed
  small files in the bundle itself.

Webpack is driven by a configuration file in `webpack.conf.js`. This
file is written in JavaScript, but not in ES6 format, so beware! Let's
take a look how it starts:

```javascript
var path = require('path');
var webpack = require('webpack');
```

We import `path`, a path manipulation utility module, and `webpack`.

The `require()` expressions here are in fact equivalent to ES6
`import` statements: in fact Webpack translates `import` statements to
`require` expressions underneath. `require` is an older way to import
modules in JavaScript that is supported by Node. We have to use it
here as we cannot use `ES6`.

Next we get a `module.exports` structure which contains the
declarative Webpack configuration:

```javascript
module.exports = {
  ...
}
```

The first bit describes the entry point:

```javascript
entry: './src/index.js',
```

Here `./src/index.js` is the file that Webpack should look at first
when bundling. Webpack includes the content of the file to the
bundle. It then follows the imports to include these as well, and so
on recursively.

Then we describe where to output the bundle:

```javascript
output: {
  path: path.join(__dirname, 'public'),
  filename: 'bundle.js'
},
```

We tell Webpack we want the bundle in the `public` subdirectory. We
use a bit of path manipulation here to create the right path to the
subdirectory using the `path` module we imported earlier.  We also
want the bundle to be called `bundle.js`.

Now we set up loaders. I'm not going to show them all here, but we look
at the first three:

```javascript
module: {
  loaders: [
    { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    { test: /\.css$/, loader: "style-loader!css-loader" },
    // inline base64 URLs for <=8k images, direct URLs for the rest
    { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
    ...
  ]
}

The first loader declares that for files that end with `.js` we want
to use the `babel-loader`. We also say that we *only* want to use
Babel for the files in our own project, *not* for any files in
`/node_modules`.  If we didn't put in the `exclude`, we'd use the
Babel loader for all JavaScript files, but `/node_modules` normally
only contains non-ES6 code so this is unnecessary and would be too
slow.

Next we declare that for files that end with `.css` we want to use the
`style-loader`, and the `css-loader`. This makes it so that when we
import any CSS (such as Bootstrap) in our JavaScript code it gets
added to our bundle. We do want this to work for CSS in node_modules, so
we don't add an `exclude`.

The third declaration states that for files that end with `.png` or
`.jpg` we want to be able to import them as well. This allows
constructions like this:

```javascript
import myImage from './myImage.jpg';

...

$('#foo').append($(`<img src="${ myImage }" />`));
```

The `import` statement causes `myImage` to contain a URL to the image
which we can then use. The `url-loader` will create links to embedded
images if the image is smaller than 8 kilobytes.

We have other loaders in `webpack.config.js` that help load various
font formats that the Bootstrap CSS uses.

Finally we set a `devtool` option:

```javascript
devtool: 'source-map',
```

We do this to make Webpack produce a source map. The source map is
used by the browser devtools to show the original ES6 source code even
though your browser is actually running code translated by Babel. This
is nice when you're debugging -- you can set breakpoints in the original
souce code and step through it.

eslint
------

A linter is a tool that can inspect our code for common errors and
style deviations. It's very valuable in a JavaScript project, as there
are some common pitfalls you want to avoid. You can run a linter from
the command line. A linter is even better if you plug it into your
favorite editor or IDE so it can show feedback as you write the code
-- do investigate that for your favorite editor.

We're going to use [eslint](http://eslint.org/) here, as it supports
ES6 JavaScript.

Here is how to install it:

```ShellSession
$ npm install -g eslint
```

Here is the version I have installed:

```ShellSession
$ eslint --version
v1.7.2
```

The version is somewhat important: older versions of eslint have a
variety of linting rules enabled by default, but newer versions do not
do this anymore. Instead you need to use `extends`, as we describe later.

To get eslint to deal with any syntax Babel supports we also need to
install the [babel-eslint](https://github.com/babel/babel-eslint)
parser:

```ShellSession
$ npm install -g babel-eslint
```

eslints allows a lot of different configurations. We've picked the
popular [airbnb styleguide](https://github.com/airbnb/javascript)
style guide. We install the eslint rules:

```ShellSession
$ npm install -g eslint-config-airbnb
```

Now we're ready to use the airbnb rules in our eslint configuration,
in `.eslintrc` in our project directory:

```JSON
{
  "extends": "airbnb/base"
}
```

Here we say we want to use the eslint configuration rules from the
base airbnb style guide. We use `"airbnb/base"` instead of `"airbnb"`
as the latter also includes some React-specific rules. We don't use
React in this example project, so we don't need that. Note that the
airbnb rules use the `babel-eslint` parser automatically so we do not
need to configure it manually.

We can deviate from the airbnb style guide and change [an eslint
rule](http://eslint.org/docs/rules/):

```JSON
{
  "extends": "airbnb/base",
    "rules": {
      "id-length": 0
   }
}
```

This allows us to use variable identifiers of 1 character, such as
`i`, something that the airbnb rules forbid. Do what is appropriate
for your team and project.

Don't want to use the airbnb rules? Other default style
configurations for eslint are available in the
[eslint-config-defaults](https://www.npmjs.com/package/eslint-config-defaults)
package.  Note that to use it with a global eslint, you need to
install it with the `-g` option as well.

Some guides recommend you install eslint and configurations locally
into a project (without `-g` and using `--save-dev`). We chose not to
do so here, as it makes it harder to use eslint from the command line
and makes editor and IDE integration more complex. On the other hand,
a locally installed eslint has the benefit that everyone gets the
versions of the tools automatically you need in a particular project,
as you can specify them exactly in `package.json`.

To use a locally installed eslint you must write the following on the
command line from the project directory:

```ShellSession
$ ./node_modules/./bin/eslint
```

You can also add the following to `package.json` under `"scripts"`:

```JSON
"lint": "eslint"
```

If you do this, you can type this:

```ShellSession
$ npm lint myfile.js
```

to do linting. It looks for a locally installed `eslint` but barring
that uses the global one.

