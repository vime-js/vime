---
title: Installation
sidebar_label: Installation
---

Vime provides various packages that can be used to quickly get started depending on the
library/framework you're using.

## CDN

The easiest way to get going with Vime is to simply load it from a CDN. We highly recommend
using [JSDELIVR](https://www.jsdelivr.com) for the best performance. Simply insert the following
inside the `<head>` element of your HTML file.

```html
<!-- Default theme (if you're creating your own skip this). ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/light.css"
/>

<!-- Library and all of its components are lazy loaded, so nothing to sweat about here. ~3kB -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@vime/core/dist/vime/vime.esm.js"
></script>
```

And ... we're all done 🎉 &nbsp;Let's move on to [setting up our player](./player).

## Svelte

You have two options with Svelte due to it having perfect [web components support](https://custom-elements-everywhere.com/#svelte).
You can either follow the instructions for loading it from the [CDN](#cdn) and use the
Vime web components in their natural form, or you can use the Svelte bindings from the `@vime/svelte`
package, which wraps all the web components inside Svelte components so you can feel right at home.
Some other advantages for using `@vime/svelte` include typed + documented components, and additional
helpers for extending Vime with custom components.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the `<head>` element of your HTML file:

```html
<!-- Default theme (if you're creating your own skip this). ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/light.css"
/>
```

Now let's install the `@vime/svelte` package by running the following in your terminal:

```bash
npm i @vime/svelte
```

And ... we're all done 🎉 &nbsp;Let's move on to [setting up our player](./player).

## React

Unfortunately React has poor [web components support](https://custom-elements-everywhere.com/#react) ... but
we have you covered with our `@vime/react` package, which wraps all the Vime web components inside
React components so it feels natural to interact with, and it removes all the limitations of working
with web components inside React.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the `<head>` element of your HTML file:

```html
<!-- Default theme (if you're creating your own skip this). ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/light.css"
/>
```

Now let's install the `@vime/react` package by running the following in your terminal:

```bash
npm i @vime/react
```

And ... we're all done 🎉 &nbsp;Let's move on to [setting up our player](./player).

## Preact

You have two options with Preact due to it having perfect [web components support](https://custom-elements-everywhere.com/#preact).
You can either follow the instructions for loading it from the [CDN](#cdn) and use the
Vime web components in their natural form, or you can use the Vime React components by setting
up [`preact-compat`](https://github.com/preactjs/preact-compat), and following the [React](#react)
installation instructions.

## Vue

You have two options with Vue due to it having perfect [web components support](https://custom-elements-everywhere.com/#vue).
You can either follow the instructions [here](https://stenciljs.com/docs/vue) for loading the
web components in their natural form, or you can use the Vue bindings from the `@vime/vue`
package, which wraps all the web components inside Vue components so you can feel right at home.
Some other advantages for using `@vime/vue` include typed + documented components, and additional
helpers for extending Vime with custom components.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the `<head>` element of your HTML file:

```html
<!-- Default theme (if you're creating your own skip this). ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/light.css"
/>
```

Now let's install the `@vime/vue` package by running the following in your terminal:

```bash
npm i @vime/vue
```

And ... we're all done 🎉 &nbsp;Let's move on to [setting up our player](./player).

## Angular

You have two options with Angular due to it having perfect [web components support](https://custom-elements-everywhere.com/#angular).
You can either follow the instructions [here](https://stenciljs.com/docs/angular) for loading the
web components in their natural form, or you can use the Angular bindings from the `@vime/angular`
package, which wraps all the web components inside Angular components so you can feel right at home.
Some other advantages for using `@vime/angular` include typed + documented components, and additional
helpers for extending Vime with custom components.

Let's first load the CSS for the player themes, which are small files that only contain a bunch of
CSS variables for styling the player. Add the following to the `<head>` element of your HTML file:

```html
<!-- Default theme (if you're creating your own skip this). ~960B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/default.css"
/>

<!-- Optional light theme (extends default). ~400B -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core/themes/light.css"
/>
```

Now let's install the `@vime/angular` package by running the following in your terminal:

```bash
npm i @vime/angular
```

And ... we're all done 🎉 &nbsp;Let's move on to [setting up our player](./player).
