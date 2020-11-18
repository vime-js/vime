---
title: Installation
sidebar_label: Installation
---

Vime provides various packages that can be used to quickly get started depending on the
library/framework you're using, scroll down to the section that is relevant to you.

:::note
If you have any issues or struggles with the installation steps below please 
[raise an issue](https://github.com/vime-js/vime/issues/new) 🐛
:::

## CDN

The easiest way to get going with Vime is to simply load it from a CDN. We highly recommend
using [JSDELIVR](https://www.jsdelivr.com) for the best performance. Simply insert the following
inside the `<head>` element of your HTML file.

```html
<!-- Default theme. ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/light.css"
/>

<!-- Library and all of its components are lazy loaded, so nothing to sweat about here. ~3kB -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@vime/core@^5/dist/vime/vime.esm.js"
></script>
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## Rollup / Webpack

A [custom elements bundle](https://stenciljs.com/docs/custom-elements) is available so you can 
import components and register them individually. This is a more flexible alternative to the 
lazy loading approach used by the [CDN](#CDN).

Let's install the `@vime/core` package by running the following in our terminal...

```bash
npm i @vime/core
```

Now let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. You can either load them from the [CDN](#cdn), or bundle them 
into your project directly (this will require a plugin). See our example configurations for 
[Rollup](https://github.com/vime-js/vime/tree/master/examples/rollup/rollup.config.js) and 
[Webpack](https://github.com/vime-js/vime/tree/master/examples/webpack/webpack.config.js).

```js
// Default theme. ~960B
import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';
```

Now you can can start bundling Vime by importing the components you require **and their dependencies** 
into your project, and registering them in the custom elements registry like so...

:::info
All components list their dependencies inside their API documentation under the `##Dependencies` 
section. See the [Video](../components/providers/video#dependencies) component as an example.
:::

```js
import { VmPlayer, VmVideo, VmFile, defineCustomElements } from '@vime/core';

// 1. Manually define them to be as efficient as possible.
customElements.define('vm-player', VmPlayer);
customElements.define('vm-video', VmVideo);
customElements.define('vm-file', VmFile);

// 2. Can't be bothered? Load them all in, may bloat your final bundle size a little.
defineCustomElements();
```

And ... we're all done 🎉 &nbsp; Let's move onto [setting up our player](./player).

## Stencil

Luckily for you Vime is built with [Stencil](https://stenciljs.com) so it works out of the box 
very easily.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. You can either load them from the [CDN](#cdn), or if 
you're using the Shadow DOM throughout your application, add the following (after adjusting paths) to 
the component that is wrapping the player...

```css title="[component].css"
/* Default theme. ~960B */
@import "../../../node_modules/@vime/core/themes/default.css";

/* Optional light theme (extends default). ~400B */
@import "../../../node_modules/@vime/core/themes/light.css";
```

Now let's install the `@vime/core` package by running the following in our terminal...

```bash
npm i @vime/core
```

Finally, we import it into the root of our application...

```ts title="index.ts"
import '@vime/core';
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## Svelte

You have two options with Svelte due to it having perfect 
[web components support](https://custom-elements-everywhere.com/#svelte). You can either follow the 
instructions for loading it from the [CDN](#cdn) and use the Vime web components in their natural 
form, or you can use the Svelte bindings from the `@vime/svelte` package, which wraps all the web 
components inside Svelte components so you can feel right at home. Some other advantages for using 
`@vime/svelte` include typed + documented components, and additional helpers for extending Vime with 
custom components.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the `<head>` element of your HTML file...

```html
<!-- Default theme. ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/light.css"
/>
```

Now let's install the `@vime/svelte` package by running the following in our terminal...

```bash
npm i @vime/svelte
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## React

Unfortunately React has poor [web components support](https://custom-elements-everywhere.com/#react) ... but
we have you covered with our `@vime/react` package, which wraps all the Vime web components inside
React components so it feels natural to interact with, and it removes all the limitations of working
with web components inside React.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the root of your application...

```ts
// Default theme. ~960B
import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';
```

Alternatively, you can load the themes from the [CDN](#cdn). Now let's install the `@vime/react`
package by running the following in our terminal...

```bash
npm i @vime/react
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## Preact

You have two options with Preact due to it having perfect [web components support](https://custom-elements-everywhere.com/#preact).
You can either follow the instructions for loading it from the [CDN](#cdn) and use the
Vime web components in their natural form, or you can use the Vime React components by setting
up [`preact-compat`](https://github.com/preactjs/preact-compat), and following the [React](#react)
installation instructions.

## Vue

:::info
Vime now supports both Vue 2 (`@vime/vue`) and Vue 3 (`@vime/vue-next`) 🚀
:::

You have two options with Vue due to it having perfect 
[web components support](https://custom-elements-everywhere.com/#vue). You can either follow the 
instructions [here](https://stenciljs.com/docs/vue) for loading the web components in their natural 
form, or you can use the Vue bindings from Vime, which wrap all the web components 
inside Vue components so you can feel right at home.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the root of your application...

```ts
// Default theme. ~960B
import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';
```

Alternatively, you can load the themes from the [CDN](#cdn). Now let's install the package
by running the following in our terminal...

```bash
# Vue 2
npm i @vime/vue

# Vue 3
npm i @vime/vue-next
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## &nbsp;Angular

> Are you a [🥕 &nbsp;farmer](https://twitter.com/search?q=angular%20(from%3Abenawad))?

You have two options with Angular due to it having perfect [web components support](https://custom-elements-everywhere.com/#angular). You can either follow the instructions [here](https://stenciljs.com/docs/angular) for 
loading the web components in their natural form which can be slightly tedious, or you can use 
the `@vime/angular` package to make the installation a breeze. 

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the root of your application styles...

```css
/* Default theme. ~960B */
@import '~@vime/core/themes/default.css';

/* Optional light theme (extends default). ~400B */
@import '~@vime/core/themes/light.css';
```

Alternatively, you can load the themes from the [CDN](#cdn). Now let's install the `@vime/angular`
package by running the following in our terminal...

```bash
npm i @vime/angular
```

For the last step we simply need to import the `Module` into our application, you can do this 
at the root `AppModule` or wherever makes the most sense:

```ts title="app.module.ts"
import { NgModule } from '@angular/core';
import { VimeModule } from '@vime/angular';

@NgModule({
  imports: [
    VimeModule,
  ],
})
export class AppModule {
  // ...
}
```

And ... we're all done 🎉 &nbsp;Let's move onto [setting up our player](./player).
