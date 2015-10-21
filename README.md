Bundling Toolchain Example
==========================

Introduction
------------

This project is an example of how you can bundle JavaScript code ready
for the web. We'll also detail some useful tools you can use along the
way.

Many such examples exist. Many examples use a tool like grunt or gulp
and quite a bit of custom JavaScript. We aim to avoid this. We want
power but stay minimalistic as possible and aim for declarative
configuration.

So to get started, clone this Github repo and follow along.

Preliminaries
-------------

To use a bundling toolchain at all you first need a working
[Node](https://nodejs.org) environment:

The Node version I use at the time of writing is:

    $ node --version
    v4.2.1

A package manager for node called [npm](https://docs.npmjs.com/) is
automatically installed along with Node. We're going to use it a lot.

`npm` can install packages locally in a `node_modules` in a project
directory. We'll use that later when we start bundling code for the
web. But for the toolchain it is convenient to install some packages
globally so they're easy to access on the commandline.

You install tools globally by passing the `-g` option to npm. We'll
see an example of that later. Your operating system may however not
let you install this stuff unless you're the superuser, which is not
very nice. If you're in that situation, I recommend you configure
`npm` so that you [use a directory under your home
directory](https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-2-change-npm-s-default-directory-to-another-directory)
first.

The version of npm that ships with Node at the time of writing is
still npm v2. npm v3 has features that help with bundling. It's at the
time of writing still in a late beta, but it should eventually ship by
default with node v5. You can check the version of your npm installation
using this command:

    $ npm --version

At the time of writing I use this version:

    v3.3.8

If you have npm v2 and you want to upgrade it to npm v2, or you just
want to upgrade npm to the latest version anyway, you can use this
command:

    $ npm install npm@latest -g

Tools
-----

We're now going to install some tools globally.

### Babel

The JavaScript language has recently seen an update called ES6 (aka
ES2015) which adds [many useful
features](https://babeljs.io/docs/learn-es2015/). We rely on these
features in this example, in particular the new `import` statements.

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

    $ npm install -g babel

You now have some new command-line tools available. `babel` is a tool
that lets you compile ES6 code manually: it takes in ES6 JavaScript
and outputs compatible JavaScript. We're going to automate Babel so
won't be using this tool, but you can use if you're curious about what
Babel actually does.

`babel-node` is more useful for our purposes. It can be used as a
replacement for the `node` command-line to run scripts that use ES6
features:

    $ babel-node myscript.js

You can also try out ES6 features on the command prompt. Here we use
arrow (`=>`) functions:

    $ babel-node
    > (a => a + a)(3)
    6

Babel can be configured using the `.babelrc` configuration file in your
project. Ours is very simple:

    {
      "stage": 2
    }

We could in fact entirely omit it, as stage 2 is the default for
Babel.  This enables ES6 and a [few well-established draft
proposals](https://babeljs.io/docs/usage/experimental/) for the next
version of JavaScript. If you want to play it safe you could increase
the stage all the way up to 4 -- Babel will only allow official ES6
and nothing more.

### eslint

A linter is a tool that can inspect our code for common errors and
style deviations. We're going to use [eslint](http://eslint.org/)
here, as it supports ES6 JavaScript.

Here is how to install it:

    $ npm install -g eslint

The version I use during writing is this one:

    $ eslint --version
    v1.7.2

The version is somewhat important: older versions of eslint have a
variety of linting rules enabled by default, but newer versions do not
do this anymore. Instead you need to use `extends`, as we describe later.

To get eslint to deal with any syntax Babel supports we also need to
install the [babel-eslint](https://github.com/babel/babel-eslint)
parser:

    $ npm install -g babel-eslint

eslints allows a lot of different configurations. We've picked the
popular [airbnb styleguide](https://github.com/airbnb/javascript)
style guide. eslint rules skip in a reusable package which we also
need to install:

    $ npm install -g eslint-config-airbnb

Now we're ready to use this styleguide in our eslint configuration, in
`.eslintrc` in our project directory:

    {
      "extends": "airbnb/base"
    }

Here we say we want to use the eslint configuration rules from the
base airbnb style guide. We use `"airbnb/base"` instead of the simpler
`"airbnb"` as the latter also includes some React-specific rules,
which we do not need in this example project.

We in fact deviate from the airbnb style guide and change [an eslint
rule](http://eslint.org/docs/rules/):

    {
      "extends": "airbnb/base",
      "rules": {
        "id-length": 0
      }
    }

This allows us to use variable identifiers of 1 character, such as
`i`. Do what is appropriate for your team and project.

Don't want to use the airbnb styles? Other default style
configurations for eslint are available in the
[eslint-config-defaults](https://www.npmjs.com/package/eslint-config-defaults)
package.  Note that to use it with a global eslint, you need to
install it with the `-g` option as well.

Some guides recommend you install eslint and configurations locally
(without `-g`) into a project and not globally. We chose not to do so
here, as it makes it harder to use eslint from the command line and
makes editor and IDE integration more complex. On the other hand, a
locally installed eslint has the benefit that everyone gets the
versions of the tools you need in a particular project, as you can
specify them in `package.json`.

To use a locally installed eslint you must write the following on the
command line from the project directory:

    $ ./node_modules/./bin/eslint

You can also add the following to `package.json` under `"scripts"`:

    "lint": "eslint"

If you do this, you can type this:

    $ npm lint myfile.js

to do linting. It looks for a locally installed `eslint` but barring
that uses the global one.

### Webpack

Now let's get
Installing the bundle example
-----------------------------