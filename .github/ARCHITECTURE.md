# 🏗️ Architecture

At the root of Vime we always have the [`vm-player`](../src/components/core/player/player.tsx)
component, which maintains the current state of the player and keeps plugins, providers and UI components
in sync. Properties are passed down from the player to update child components through a context
provider (exactly like `React.ContextProvider`), and updates are sent to the player by dispatching
events. The event simply contains the property to update and its new value `{ prop: 'paused', value: false }`.
Any "special" properties that require calling a method on the provider are watched and called
automatically. For example, updating the `currentTime` property will trigger a call to the provider's
`setCurrentTime` method.

It's important to note that changes don't happen immediately but rather asynchronously,
they are processed and queued to happen in the next render cycle.

There are only "two" simple functions that matter when creating a new Vime component and interacting
with the player. Let's go through them briefly one at a time.

The `withPlayerContext` (`withProviderContext` for providers) function simply behaves as
`Context.Consumer` in React. It wraps the component class and enables properties to be passed down
from the player directly to components, bypassing any parent components in the tree. You can refer
to existing Vime components to see its usage. A separate context function is used for providers
simply as a shorthand, because all providers require the same subset of player properties.

The `createDispatcher` (`createProviderDispatcher` for providers) function creates an event dispatcher
to send updates to the player through the `vmStateChange` (`vmProviderChange` for providers) event. The
dispatcher is typed to simply take in a player property that can be written to, and its new value. You
can refer to existing Vime components to see its usage. A separate event is used for providers
because they have additional write privileges (`buffered`, `seeking` etc.), and it helps the
player cache the state of the provider to know when an adapter call is required.
