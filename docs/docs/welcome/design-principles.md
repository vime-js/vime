---
title: Design Principles
sidebar_label: Design Principles
---

- 🎨 &nbsp;**Customization.** Every part of Vime should be optional, easily accessible and customizable.
  Some ways this is achieved today is:

  - No shadow DOM so all components can be directly referenced and modified freely through the DOM or framework.
  - CSS variables are available for all components so they can be styled accordingly.
  - Every single component is optional aside from the root `vime-player` component.
  - All component's core behaviour, style and function can be modified via properties and methods.

- 🧰 &nbsp;**Defaults.** The more you customize something to fit your desired need/want, the more
  time and effort is required. For some this is not an option. Vime ensures there are well-built and
  extendable defaults out of the box. This includes:

  - Light/dark themes.
  - Default controls for all devices and types of media.
  - Default settings menu that is provider-aware.

- 🤗 &nbsp;**User experience.** At the end of the day, our ultimate goal as developers is to build
  products that our users/customers enjoy using, and it solves real world problems in their lives. Vime
  strives for great UX by:

  - Simple, clean and visually pleasing aesthetics that anyone can enjoy.
  - The ability to use the player at its full potential regardless of language (i18n), disability (accessible)
    and device (responsiveness).
  - Intuitive iconography, default controls and shortcuts so users are not overwhelmed or left confused.
  - Multiple text tracks and captions support, so everyone can understand and enjoy all content.

- 💻 &nbsp;**Developer experience.** We discussed the importance of a great user experience above,
  and for Vime that user is you, the developer. We strive for great UX in the following ways:

  - A comprehensive player API. The player is at the root of Vime, thus it is the most interacted
    with component. It must contain a rich API for controlling the state of the player and playback of media.
  - A steep learning curve is time-consuming, and time is something we don't have enough of. Thus, we
    use web components which rely on technologies (HTML/CSS/JS) that every web developer is familiar with.
    In addition, we provide framework-specific bindings for some of the most popular frameworks, so you
    can get up and running even quicker.
  - Vime is built with TypeScript so you can enjoy type checking, code autocompletion, hints and
    snippets in your IDE.
  - Interacting with Vime components should be intuivite from the way they're named, composed and
    modified.
  - Great documentation is key for an awesome developer experience. All component properties, methods
    and events are documented. In addition, the documentation for this site is completely
    open-sourced and can be easily improved by anyone in the community, including you!

- 🛠 &nbsp;**Contributor experience.** Vime wouldn't be possible without people donating their
  time to making it what it is. We aim to improve the experience of contributing to Vime by:

  - Anyone can be a contributor! There's no special application process or requirements, jump
    right in.
  - A detailed [contributing guide](https://github.com/vime-js/vime/blob/master/CONTRIBUTING.md) has
    been created to get you from zero to PR.
  - The [#contributors](https://discord.gg/feZ6cAE) channel has been created for contributors
    to help each other, and get feedback on new ideas.
  - There are many ways to contribute and they don't all involve writing code, we have some ideas on the
    [next page](./contributing.md#get-involved).
  - We continuously strive for as little friction as possible for new contributors, everything
    is organized to help you get started quickly.
  - All the ugly and boring parts have been automated by our continous integration system (GitHub Actions).
    Simply clone, make changes and push!

- 🧪 &nbsp;**Testing.** All of us probably could do more testing, but we've dedicated extra time
  and attention to ensuring Vime is tested as much as possible. Over 200+ unit tests, UI E2E tests,
  accessibility tests, and a provider test harness all ensure Vime is functioning correctly and
  up-to-standard. All package releases must go through our full suite of tests before being sent out
  into the wild.
