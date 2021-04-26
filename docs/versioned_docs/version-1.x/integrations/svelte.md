---
title: Svelte Integration
sidebar_label: Svelte
---

If you're using the `@vime-js/complete` package inside Svelte then you'll need to do a little extra
setting up. For all other packages you don't need to do anything special, compile it the same as you'd
compile any other Svelte component.

There are setup instructions below for:

- [Rollup](#rollup)
- [Webpack](#webpack)

## Rollup

In addition to your usual [setup](../complete/setup.md) you'll need to do the following.

:::info
If you want to start an application quickly then checkout the [official Svelte Rollup template][svelte-rollup-template].
:::

[svelte-rollup-template]: https://github.com/sveltejs/template

### Install

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
defaultValue="npm"
values={[
{ label: 'NPM', value: 'npm' },
{ label: 'Yarn', value: 'yarn' },
]}>

<TabItem value="npm">

```
npm install svelte-preprocess node-sass @rollup/plugin-replace --save-dev
```

</TabItem>

<TabItem value="yarn">

```
yarn add svelte-preprocess node-sass @rollup/plugin-replace -D
```

</TabItem>

</Tabs>

### Configure

Extend your Rollup configuration with the following

```js
import replace from '@rollup/plugin-replace';
import sveltePreprocess from 'svelte-preprocess';

export default {
  // ...
  svelte({
    // ...
    preprocess: sveltePreprocess()
  }),
  replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })
}
```

## Webpack

In addition to your usual [setup](../complete/setup.md) you'll need to do the following.

:::info
If you want to start an application quickly then checkout the [official Svelte Webpack template][svelte-webpack-template].
:::

[svelte-webpack-template]: https://github.com/sveltejs/template-webpack

### Install

<Tabs
defaultValue="npm"
values={[
{ label: 'NPM', value: 'npm' },
{ label: 'Yarn', value: 'yarn' },
]}>

<TabItem value="npm">

```
npm install svelte-preprocess node-sass --save-dev
```

</TabItem>

<TabItem value="yarn">

```
yarn add svelte-preprocess node-sass -D
```

</TabItem>

</Tabs>

### Configure

Extend your Webpack configuration with the following

```js
const sveltePreprocess = require('svelte-preprocess');
const EnvironmentPlugin = require('webpack').EnvironmentPlugin;

module.exports = {
  // ...
  module: {
    // ...
    rules: [
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            // ...
            preprocess: sveltePreprocess(),
          },
        },
      },
      // ...
    ],
  },
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    // ...
  ],
};
```
