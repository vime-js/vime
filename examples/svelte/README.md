# @vime/svelte-example

This example was bootstrapped using the [`sveltejs/template`](https://github.com/sveltejs/template),
and demonstrates how to setup Vime with Svelte via the `@vime/svelte` package. The main file to
look at is [`src/App.svelte`](./src/App.svelte), and if you're intrested in building custom components
see [`TapSidesToSeek.svelte`](./src/TapSidesToSeek.svelte).

For the curious, [`@vime/media`](../../packages/media) is a private package that contains a collection
of audio and video files, and are used here to help with demonstrating the player. You're free to
ignore it and supply your own media files.

## Usage

Install [pnpm](https://pnpm.js.org/en/installation) and then run the following commands to serve
the example.

```bash
# This will take some time (~480MB), but you only have to do it once.
$: git clone https://github.com/vime-js/vime

$: cd vime/examples/svelte

$: npm run setup

$: npm run serve
```
