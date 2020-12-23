# 🎥 Providers

Providers are responsible for loading players/media and controlling it. For example, the YouTube
provider sets up the YouTube player embed and loads a video through it. All providers implement the
[`MediaProvider`](../core/src/components/providers/MediaProvider.ts) interface.

Let's pretend we're creating a new provider for Twitch, the steps will generally go as follows:

1. Make sure we're in the root of the [`core`](../core) package directory.
2. Run the following script `npm run generate:provider` and pass in the name `Twitch`.
3. Go to `src/components/providers/twitch`.
4. Create interfaces for the parameters, commands, events and messages that the Twitch embed
   takes and fires. Make sure everything is documented, most the time it's simply copy and pasting from
   the provider's documentation. Always refer to existing providers for some guidance.
5. Setup the properties that we will expose on the component to set player parameters.
6. The Twitch player is loaded in an `<iframe>` so we'll need to setup the `Embed` component.

From here onwards it's best to refer to existing providers as a guide and slowly implement each
method you see. Don't forget to emit the `vmLoadStart` event when new media is loading, and to
finalize the `getAdapter` method.

As we're building out our provider we'll want to see and test it in the browser. There's
already a file setup to do this. Go to the [`playground`](../core/src/components/core/playground/index.html)
component and add the provider just like the others have already been done so. You can serve the dev environment
`npm run serve`, and select the file through the explorer to begin interacting with it in the browser.

After we wrap up all our testing and we're satisfied, the final steps are:

1. Create a `usage` directory inside the provider directory and add examples for the same 
frameworks that are listed for all other providers.
2. Run the build script `npm run build`.
3. Add small description about the provider to the auto-generated [component documentation](../docs/docs/components/providers)
   (above the `<-- Auto Generated Below -->` comment). See other providers as an example.
4. Commit your changes `git commit -m 'feat(core/providers): add twitch provider'`
5. Create a PR!