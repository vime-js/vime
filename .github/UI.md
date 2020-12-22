# 🖥️ UI Components

UI components are visually displayed elements inside the media player that may be interactable
such as a playback control, slider etc. The [Architecture](./ARCHITECTURE) section above describes mostly what
you need to know to create a UI component, and you can refer to existing components to guide you.

When creating new components you need to be aware of if it'll be displayed in an audio or video
player. Hide/show and position it accordingly, and if it's inside a video player then be aware of
the `z-index` and `pointer-events` css properties of any elements that are positioned absolutely,
such as a container that stretches out the entire video player. We don't want to block other
components and prevent them from being interacted with. Open the 
[default theme](../core/src/themes/default.css), and go to the `Z-Index` section 
to see existing z-index levels.

If you're creating any new CSS variables then make sure to document them (see existing components on
how to do so), and set the values inside the [default theme](../core/src/themes/default.css)
CSS file. If the component also has a light theme, set the variable values inside the
[light theme](../core/src/themes/light.css) CSS file.

After we wrap up all our testing and we're satisfied, the final steps are:

1. Create a `usage` directory inside the component directory and add examples for the same frameworks 
that are listed for all other components.
2. Run the build script `npm run build`.
3. Add small description about the component to the auto-generated [component documentation](../docs/docs/components/ui)
   (above the `<-- Auto Generated Below -->` comment). See other components as an example.
4. Commit your changes `git commit -m '{feat/fix}(core/ui): {message}'`
5. Create a PR!