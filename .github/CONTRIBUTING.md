# Contributing

First off, thank you for taking the time to contribute to Vime ❤️

This document will guide you on how to go from zero to PR!

## 💭 Knowledge

### TypeScript

It's important to note early on that this project is written with
[TypeScript](https://www.typescriptlang.org/). If you're unfamiliar with it or any strongly typed
languages such as Java then this may be a slight roadblock. However, there's never a truly perfect
time to start learning it, so ... why not today! You can always reach out on our Discord if
you get stuck.

### Stencil

This project relies on [Stencil](https://stenciljs.com) to build and distribute
[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components). As a contributor
you don't really need to worry about much other then how to simply
[build components](https://stenciljs.com/docs/decorators). If you're already familiar with
ES6 classes, decorators and JSX then this will all be a walk in the park. There's really not much
more to it. You can always refer to existing components in Vime to see how to accomplish certain
tasks.

## 🎒 Getting Started

### Install

Let's setup our machine. The only software you'll need to install is:

- [node](https://nodejs.org/en/download/)
- [git](https://git-scm.com/downloads)

They're very easy to install, just follow the links and you should be up and running in no time.

### Fork + Clone

Now we need to fork and clone the repository, install all the projects dependencies, and create
a separate branch to work on our feature/fix. We can name the branch by the
[issue](https://github.com/vime-js/vime/issues) number on GitHub such as `issue-64`. It's always
best to create an issue before submitting a PR. If you haven't, then you can simply name the branch
whatever you want, no wrong answers here.

Head over to the [Vime repository](https://github.com/vime-js/vime) on GitHub and click the `Fork`
button in the top right corner. After the project has been forked, run the following commands in
your terminal:

```bash
$: git clone https://github.com/{my-github-username}/vime --depth=1

$: cd vime

$: git checkout -b {issue-64}
```

Now it'll help if we keep our `master` branch pointing at the original repository and you make pull
requests from branches on your fork.

```bash
# Add the original repository as a "remote" called "upstream".
$: git remote add upstream git@github.com:vime-js/vime.git

# Fetch the git information from the remote.
$: git fetch upstream

# Set your local master branch to use the upstream master branch whenver you run `git pull`.
$: git branch --set-upstream-to=upstream/master master

# Run this when we want to update our version of master.
$: git pull
```

## 🏗️ Architecture

For how Vime works in general see the [Architecture](./ARCHITECTURE.md) document.

## 🖥️ UI

For how to add new UI components or work on them in general see the [UI](./UI.md) document.

## 🎥 Providers

For how to add new providers or work on them in general see the [Providers](./PROVIDERS.md) document.

## 📖 Documentation

The documentation website is created with [Docusaurus](https://v2.docusaurus.io) and can be found
in the [`docs`](../docs) directory at the root. To start writing documentation simply follow the
instructions over in said directory.

## ✍️ Commit

We commit our changes by running `git commit -m 'commit message'`.

This project uses [semantic commit messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
to automate package releases. Simply refer to the link, and also see existing commits to get an
idea of how to write your message.

## 🎉 Pull Request

When you're all done, push your changes up to GitHub and head over to the
[Vime repository](https://github.com/vime-js/vime). To create a pull request, click the big
green `Compare & Pull Request` button that should appear after you've pushed your changes.

Don't expect your PR to be accepted immediately or even accepted at all. Give the community time
to vet it and see if it should be merged into Vime. One of the following events will happen:

1. You listen to feedback/reviews and make the necessary changes for it to be approved.
2. The changes are rejected by the community and you can try to understand why, or ask more questions
   to clarify.
3. Your changes are approved and merged into Vime.

Please don't be disheartened if it's not accepted. Your contribution is appreciated more then you can
imagine, and even a failed PR can teach us a lot ❤️
