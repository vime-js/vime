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
  href="https://cdn.jsdelivr.net/npm/@vime/core@4/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@4/themes/light.css"
/>

<!-- Library and all of its components are lazy loaded, so nothing to sweat about here. ~3kB -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@vime/core@4/dist/vime/vime.esm.js"
></script>
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## Svelte

> Svelte... you are like the arms of a 🦖 &nbsp;small... but part of something powerful.

You have two options with Svelte due to it having perfect [web components support](https://custom-elements-everywhere.com/#svelte).
You can either follow the instructions for loading it from the [CDN](#cdn) and use the
Vime web components in their natural form, or you can use the Svelte bindings from the `@vime/svelte`
package, which wraps all the web components inside Svelte components so you can feel right at home.
Some other advantages for using `@vime/svelte` include typed + documented components, and additional
helpers for extending Vime with custom components.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the `<head>` element of your HTML file...

```html
<!-- Default theme. ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@4/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@4/themes/light.css"
/>
```

Now let's install the `@vime/svelte` package by running the following in your terminal...

```bash
npm i @vime/svelte
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## React

> React... you are like pineapple on 🍕 &nbsp;some love it and some hate it.

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
package by running the following in your terminal...

```bash
npm i @vime/react
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## Preact

> Preact... you are like 🍕 &nbsp;without pineapple, how it was always meant to be.

You have two options with Preact due to it having perfect [web components support](https://custom-elements-everywhere.com/#preact).
You can either follow the instructions for loading it from the [CDN](#cdn) and use the
Vime web components in their natural form, or you can use the Vime React components by setting
up [`preact-compat`](https://github.com/preactjs/preact-compat), and following the [React](#react)
installation instructions.

## Vue

> Vue... you are like [Bob Ross](https://www.google.com/search?q=bob+ross), you enjoy painting pretty 🌳 ⛰️ ☁️ &nbsp;all-in-one place.

You have two options with Vue due to it having perfect [web components support](https://custom-elements-everywhere.com/#vue).
You can either follow the instructions [here](https://stenciljs.com/docs/vue) for loading the
web components in their natural form, or you can use the Vue bindings from the `@vime/vue`
package, which wraps all the web components inside Vue components so you can feel right at home.
Some other advantages for using `@vime/vue` include typed + documented components, and additional
helpers for extending Vime with custom components.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the root of your application...

```ts
// Default theme. ~960B
import '@vime/core/themes/default.css';

// Optional light theme (extends default). ~400B
import '@vime/core/themes/light.css';
```

Alternatively, you can load the themes from the [CDN](#cdn). Now let's install the `@vime/vue` package
by running the following in your terminal...

```bash
npm i @vime/vue
```

And ... we're all done 🎉 &nbsp; That was anticlimactic 😞 &nbsp;Let's move onto [setting up our player](./player).

## &nbsp;Angular

> Angular... you are a [🥕 &nbsp;farmer](https://twitter.com/search?q=angular%20(from%3Abenawad)).

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
package by running the following in your terminal...

```bash
npm i @vime/angular
```

For the last step we simply need to import the `VimeModule` into our application, you can do this 
at the root `AppModule` or wherever makes the most sense:

```ts title="app.module.ts"
import { NgModule } from '@angular/core';
import { VimeModule } from '@vime/angular/dist';

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
