# @vime/angular-example

This example was bootstrapped with [Angular CLI](https://cli.angular.io), and demonstrates how to
setup Vime with Angular via the `@vime/angular` package. See [`src/styles.css`](./src/styles.css)
and the [`app`](./src/app) module directory. In addition, if you're interested in building custom
components see the [`src/app/tap-sides-to-seek`](./src/app/tap-sides-to-seek) directory.

For the curious, [`@vime/media`](../../packages/media) is a private package that contains a collection
of audio and video files, and are used here to help with demonstrating the player. You're free to
ignore it and supply your own media files.

## Usage

Install [pnpm](https://pnpm.js.org/en/installation) and then run the following commands to serve
the example.

```bash
# This will take some time (~480MB), but you only have to do it once.
$: git clone https://github.com/vime-js/vime

$: cd vime/examples/angular

$: npm run setup

$: npm run serve
```
