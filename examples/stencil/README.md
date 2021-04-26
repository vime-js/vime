# @vime/stencil-example

This example was bootstrapped using the [`stencil`](https://stenciljs.com/docs/getting-started) NPM
starter, and demonstrates how to setup Vime with Stencil via the `@vime/core` package. The main files
to look at are:

- [`src/index.ts`](./src/index.ts): Shows how to simply import the player library.
- [`src/components/app-home/app-home.tsx`](./src/components/app-home/app-home.tsx): Shows how to
  setup the player.
- [`src/components/app-home/app-home.css`](./src/components/app-home/app-home.css): Shows how to
  load the default player themes.
- [`src/components/tap-sides-to-seek`](./src/components/tap-sides-to-seek): Shows how to build a
  custom component.

## Usage

```bash
$: git clone https://github.com/vime-js/vime --depth=1

$: cd vime/examples/stencil

$: npm install

$: npm run serve
```
