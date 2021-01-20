# Vime v6.0

**THIS DOCUMENT IS A WORK IN PROGRESS.**

Vime exists to simplify the process of integrating media with a custom player into a web application.
The main benefits are that it provides a unified API across multiple providers, and the foundational
components required to easily build and design the player interface.

## Design Goals

- **Composable.** All components should be easily used independently or in any valid configuration
  together. There should be minimal template lock-in or cross-component dependencies.
- **Modular.** Use only what you need and discard what you don't.
- **Extendable.** Make it easy to add what we haven't included out of the box, or to transform what
  we give you into what you need.
- **Markup First.** Most users are simply looking to customize the player interface or mess with
  component options. Thus, it'd be preferable if users can use HTML/CSS only as much as possible for
  changing component behaviour and styling without needing to get into JS. However, more advanced
  options can be made available via JS.
- **Defaults.** For everyday users wanting to get up and running ASAP there should be clean and
  simple defaults out of the box.
- **Lightweight.** To avoid delaying page loads or time to first frame for the user, the library
  should be as light as possible. Preferably less than 30kB.
- **Accessible.** Anyone should be able to use the player at its utmost potential, regardless of
  any external factors such as disabilities or network connection.
- **Framework Agnostic.** The player should be built to be future-proof and easily integrated into
  any front-end tech stack.
- **Responsive.** The player should function appropriately across all devices and screen sizes.
- **Modern.** The player should be built for the modern web and avoid bloated polyfills and outdated
  environments as much as possible. This only leads to technical bloat and time wasted. It will not
  support older browsers and will only target modern evergreen browsers that fully implement the
  Custom Elements V1 specification, e.g. Chrome, Firefox, Safari.
- **Testable.** All aspects of the player should be built with testability in mind. A comprehensive
  set of tests covering unit, visual, visual regression and integration are required to minimize bugs
  and regressions.
- **Syncable/Manageable.** Video players operate in sync to a certain degree. Changes to one player's
  volume or muted state might propagate to a stored user preference or to the state of other players
  on the current page (and possibly subsequent pages). The playback position of a video might need to
  be maintained as the user transitions from a listing view to a detail view containing the same video.
  The play event of one video might trigger pause of any other actively playing video. Vime does not
  need to provide/include a manager, but it should be designed with one in mind: an ancestral component
  that can monitor events and access an imperative API of registered playback components. This may/may
  not require a registration phase upon connection. DOM traversal may not be sufficient means of
  discovery as players could be removed and returned from the DOM in certain UIs, such as an
  infinite scroll.

### Why v6?

- **Get Lit 🔥.** Prefer a lightweight alternative to Stencil such as LitElement to:
  - Avoid heavy compilation/transpilation steps and processes.
  - Reduce library size (Stencil currently ships ~50kB of base framework
    code - [relevant?](https://twitter.com/adamdbradley/status/1349089465197862913)).
  - Have more control over package build and distribution.
  - Employ better design patterns when needed that are not allowed in Stencil such as inheritance.
  - [Go buildless](https://open-wc.org/guides/developing-components/going-buildless) to
    simplify tooling/processes around development/building/testing/packaging.
  - Make it easier for contributors as no knowledge of JSX is required with LitElement.
- The data flow between player, provider and UI will need to be assessed and improved.
- Features such as boot strategy (controls when/how providers are loaded) are not possible in v5
  because the player doesn't control the rendering of the provider. In addition there are
  inconsistencies with how providers are loaded because some logic is split between the player
  and the provider. Most logic will need to be housed in the player for better consistency.
- Simplify the process of designing custom components and reduce opinionated designs that cause
  developers to fight the system. In other words provide naked/functional components that the developer
  can do whatever they want with.
- Rethink integration packages and focus on a strong foundation, considering only what's
  necessary. The web has evolved and most modern frameworks completely support web components. The
  integration packages are mostly unnecessary at this early stage and are costing too much time
  to maintain.
- Currently there is no way to tell whether an event was initiated by the provider
  or user. To enable devs to build out features like analytics on top of Vime we'll need to
  improve/expand the events API, and clearly differentiate between provider/user initiated events.

## Project Structure

The following references have been used in determining an adequate project structure:

- [Carbon Design System - Web Components](https://github.com/carbon-design-system/carbon-web-components)
- [Adobe Spectrum - Web Components](https://github.com/adobe/spectrum-web-components)

### Folder Organization

- `packages` → Where each package is stored. A package represents a piece of functionality within
  the player that can be rendered in the browser or purely used to manage state/data (renderless).
- `packages/bundle` → The bundle package is the main entry point that exports all the public
  entities (classes, interfaces, components, types etc.).
  - `packages/bundle/index.ts` → Exports all side-effect free code that doesn't register any
    elements in the `Window` custom elements registry.
  - `packages/bundle/elements.ts` → Exports all code that is not side-effect free which
    registers all elements in the custom elements registry.
- `packages/core` → This directory contains any functionality that is at the top of the player
  hierarchy such as the `Player` component.
- `packages/providers` → This directory contains components/code that are responsible for
  loading players/media.
- `packages/ui` → This directory contains components/code that are rendered in the browser
  generally for the end-user to interact with.
- `packages/skins` → This directory contains components that are an amalgamation of UI components
  to build an out of the box look/style for the player which includes themes and icons.
- `packages/utils` → This directory contains common helper functions that are used throughout the player.

### Packaging

The library will be bundled and released as a single package under the `vime` package name. We have
contemplated releasing all packages under their own namespace such as `vime/player`, `vime/youtube`,
or `vime/mute-toggle` but there seems to be no inherit value of doing so as no use-case has been
identified for multiple NPM packages yet. Furthermore, there's no way to split the library in any
meaningful way as all components are bound to the player component in one way or another. Splitting
the library into multiple packages will only add more noise to the build/release process.

Here's a few examples of how modules can be imported:

- `import 'vime/bundle/elements'` → This will import all components provided by Vime and register
  them in the `Window` custom elements registry.
- `import { Player, MuteToggle } from 'vime/bundle'` → This will import entities without registering
  them in the custom elements registry.
- `import 'vime/core/player/vm-player'` → This will import only the player component and register it.
- `import 'vime/skins/default/vm-default'` → This will import only the default UI skin and register it.

These import paths are made possible thanks to the [exports](https://nodejs.org/api/packages.html#packages_exports)
field in `package.json` . This field is available in Node 12+ and allows defining entry points of a
package when imported by name, loaded either via a `node_modules` lookup or a self-reference to its
own name. This means instead of `vime/dist/bundle` we can import via `vime/bundle` .

Furthermore, [conditional exports](https://nodejs.org/api/packages.html#packages_conditional_exports)
will enable multiple entry points depending on certain conditions, such as providing different ES
module exports for `require` and `import` . This is useful if we decide to provide SSR friendly bundles.

### Component Package Anatomy

- _{component-name}_
  - index.ts
  - vm-_{component-name}_.ts
  - _{component-name}_.stories.ts
  - _{component-name}_.styles.ts
  - test
    - _{component-name}_.test.ts
    - _{component-name}_.benchmark.ts

## Architecture

See [architecture.md](./architecture.md) and [player-api.md](./player-api.md).

### UI Design Patterns

See [ui-patterns.md](./ui-patterns.md).

### Framework Integrations

wip.

(only considering react due to poor web components suppport). Care about SSR?

Reference: [createReactCustomElementType.ts](https://github.com/carbon-design-system/carbon-web-components/blob/master/src/globals/wrappers/createReactCustomElementType.ts)

SSR support might be coming to [Lit this quarter](https://twitter.com/justinfagnani/status/1088218448570785797).

### Internationalization (i18n)

wip.

[Shaka Player - Talking About Language](https://github.com/google/shaka-player/blob/master/docs/design/talking-about-languages.md)

### Icons

wip.

### Theming

wip.

### Build

wip.

- [GitPod](https://www.gitpod.io/) for contributors.

### Testing

wip.

- Benchmark - [Tachometer](https://github.com/Polymer/tachometer)
- Visual Manual - [Storybook](https://storybook.js.org/)
- Visual Regression - [Pixelmatch](https://github.com/mapbox/pixelmatch) / [CI Artifacts](https://docs.github.com/en/free-pro-team@latest/actions/guides/storing-workflow-data-as-artifacts)
- Unit - Open WC [Test Runner](https://open-wc.org/guides/developing-components/testing/#web-test-runner) and [Helper Package](https://open-wc.org/docs/testing/testing-package/)
- Integration - [Cypress](https://www.cypress.io/)?
- [Browser Stack](https://www.browserstack.com/)?

### Documentation

wip.

### Examples

wip.

- [Stackblitz](https://stackblitz.com/)

### Release

wip.
