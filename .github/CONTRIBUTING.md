# Contributing Guide

First off, thank you for taking the time to contribute to Vime. You'll find instructions below
on how to get yourself up and running so you can create your first PR.

## 🎒 Getting Started

### Prerequisites

Let's setup our machine. The only software you'll need to install is:

- [node](https://nodejs.org/en/download)
- [git](https://git-scm.com/downloads)
- [pnpm](https://pnpm.io/installation)
- [volta](https://docs.volta.sh/guide) or [nvm](https://github.com/nvm-sh/nvm)
  (we recommend volta)

They're very easy to install, just follow the links and you should be up and running in no time.

### Fork & Clone

Next, head over to the [Vime repository on GitHub](https://github.com/vime-js/vime) and click the
`Fork` button in the top right corner. After the project has been forked, run the following
commands in your terminal...

```bash
# Replace {github-username} with your GitHub username.
$: git clone https://github.com/{github-username}/vime --depth=1

$: cd vime

$: pnpm install
```

**OPTIONAL:** Now it'll help if we keep our `main` branch pointing at the original repository and
make pull requests from the forked branch.

```bash
# Add the original repository as a "remote" called "upstream".
$: git remote add upstream git@github.com:vime-js/vime.git

# Fetch the git information from the remote.
$: git fetch upstream

# Set your local main branch to use the upstream main branch whenver you run `git pull`.
$: git branch --set-upstream-to=upstream/main main

# Run this when we want to update our version of main.
$: git pull
```

### Node

Once you're done simply set your Node version to match the required version by Vime. If you've
installed `volta` then it will automatically pin it, and if you're using `nvm` simply run `nvm use`
from the project root.

## 💼 Package Manager (PNPM)

```bash
# Install all dependenices and symlink packages in the workspace (see `pnpm-workspace.yaml`).
$: pnpm install

# Install dependency for a single package.
$: pnpm install typescript --filter @vime/core

# Update a dependency for a single package.
$: pnpm up typescript@4.4.0 --filter @vime/core

# Update a dependency for all packages.
$: pnpm up typescript@4.4.0 -r
```

## 💻 Scripts

```bash
# Run eslint and prettier to lint files and look for any code type/style/format issues.
$: pnpm lint

# Run eslint and prettier to lint files and also auto-fix any issues.
$: pnpm format

# Run build in any of the packages in the `packages/` directory.
$: pnpm build core

# Run build and watch for changes to rebuild in any of the packages in the `packages/` directory.
$: pnpm build core -- --watch

# Build all packages in the `packages/` directory.
$: pnpm build:all

# Run a script located inside an example in the `examples/` directory.
$: pnpm example

# Shorthand without running through prompts.
$: pnpm example svelte -- --script dev

# Run a script located inside a sandbox application in the `sandbox/` directory.
$: pnpm sandbox

# Shorthand without running through prompts.
$: pnpm sandbox svelte -- --script dev
```

## 🧪 Sandbox

The `sandbox/` directory at the root of the Vime project is where we build and test Vime
applications locally. It's safe to include anything inside of this directory as it's ignored
by Git.

We can quickly scaffold applications for local development via the `pnpm sandbox:create` command
which can also handle symlinking the `@vime/*` packages.

> We're using either NPM or Yarn in the example below because, Vime uses a PNPM workspace which
> will only get in the way when running commands inside the sandbox.

```bash
# 1. make sure all local packages are built.
$: pnpm build:all

# 2. scaffold an application for local development.
$: pnpm sandbox:create svelte -- --template svelte

# 3. install dependenices in sandbox using yarn (^ reason above).
$: yarn --cwd sandbox/svelte

# 4. run sandbox dev envinroment using yarn.
$: yarn dev --cwd sandbox/svelte

# 5. run in another terminal session/window if we need to hack on a package.
$: pnpm build core -- --watch
```

## 🏗️ Architecture

For how Vime works in general see the [Architecture](./ARCHITECTURE.md) document.

## 🖥️ UI

For how to add new UI components or work on them in general see the [UI](./UI.md) document.

## 🎥 Providers

For how to add new providers or work on them in general see the [Providers](./PROVIDERS.md) document.

## 📝 Documentation Site

The documentation website is created with [Docusaurus](https://v2.docusaurus.io) and can be found
in the [`docs`](../docs) directory at the root. To start writing documentation simply follow the
instructions over in said directory.

```bash
# run development environment
$: pnpm docs:dev

# build for production
$: pnpm docs:build

# preview production site
$: pnpm docs:preview
```

## ✍️ Commit

This project uses [semantic commit messages][semantic-commit-style] to automate generating
changelogs and releases. Simply refer to the link, and also see existing commits to get an idea
of how to write your message.

If you've made changes to a specific package, simply include the package name without the
`@vime` prefix in the commit scope (see example below).

```bash
# Commit general changes.
$: git commit -m 'chore: your commit message'

# Commit changes made to a specific package (eg: @vime/core).
$: git commit -m 'fix(core): your commit message identifying fix'
```

## 🎉 Pull Request

**Working on your first Pull Request?** You can learn how from this free series
[How to Contribute to an Open Source Project on GitHub][pr-beginner-series].

Preferably create an issue first on GitHub, and then checkout a branch matching the issue number
(see example below). Once you're done, commit your changes, push to your forked repo, and create
a PR (see link above for more information if it's your first time).

```bash
# Create a branch for your PR, replace {issue-no} with the GitHub issue number.
$: git checkout -b issue-{issue-no}
```

[npm]: https://www.npmjs.com
[semantic-commit-style]: https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716
[pr-beginner-series]: https://app.egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github
