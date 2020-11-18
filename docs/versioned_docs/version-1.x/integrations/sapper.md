---
title: Sapper Integration
sidebar_label: Sapper
---

If you're using `@vime-js/complete` then you'll need to do a little bit of setting up. All the instructions 
can be found in the [Svelte integration guide](./svelte.md). Just remember to include the preprocessor for 
both the client and server in your `rollup.config.js`.

Regardless of which package you choose, make sure to include it as a `devDependency`. This is so Sapper doesn't treat 
it as an external dependency and renders it server-side, and it also helps keep the client-side 
app smaller. This is true for all Svelte packages you end up using, more information can be found 
[here][sapper-external-deps].

[sapper-external-deps]: https://github.com/sveltejs/sapper-template#using-external-components
