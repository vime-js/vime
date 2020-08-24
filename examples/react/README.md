# @vime/react-example

This example was bootstrapped with [Create React App](https://github.com/facebook/create-react-app),
and demonstrates how to setup Vime with React via the `@vime/react` package. The main
file to look at is [`App.tsx`](./src/App.tsx), and if you're interested in building custom UI
components see [`TapSidesToSeek.tsx`](./src/TapSidesToSeek.tsx).

For the curious, [`@vime/media`](../../packages/media) is a private package that contains a collection
of audio and video files, and are used here to help with demonstrating the player. You're free to
ignore it and supply your own media files.

## Usage

Install [pnpm](https://pnpm.js.org/en/installation) and then run the following commands to serve
the example.

```bash
# This will take some time (~480MB), but you only have to do it once.
$: git clone https://github.com/vime-js/vime

$: cd vime/examples/react

$: npm run setup

$: npm run serve
```
