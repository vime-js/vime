---
title: Design Principles
sidebar_label: Design Principles
---

- 🎨 &nbsp;**Customization.** Every part of Vime should be optional, easily accessible and customizable.
  This is achieved by:

  - No shadow DOM so all components can be directly referenced and modified freely through the DOM or framework.
  - We provide all the building blocks for you to create your own UI.
  - CSS variables are available for all components so you can restyle anything you want.
  - Every single component is optional aside from the root `vm-player` component.
  - All component's core behaviour, style and function can be modified via properties and methods.
  - Multi-provider support so you're free to choose what type of media to play and where you host
    your content.

- 🧰 &nbsp;**Defaults.** The more you customize something to fit your desired need/want, the more
  time and effort is required. For some this is not an option. Thus, we provide well-built and extendable
  defaults out of the box such as:

  - Light/dark themes.
  - Default controls for all devices and types of media.
  - Default settings menu that is provider-aware.

- 🤗 &nbsp;**User experience.** At the end of the day, our ultimate goal as developers is to build
  products that our users/customers enjoy using, whilst solving a problem they face. Vime strives for
  great UX by:

  - Simple, clean and visually pleasing aesthetics that anyone can enjoy.
  - The ability to use the player at its full potential regardless of language, disability or device.
  - Intuitive default controls, shortcuts and iconography so users are not overwhelmed or left confused.
  - Multiple text tracks and captions support, so everyone can understand and enjoy your content.

- 💻 &nbsp;**Developer experience.** We discussed the importance of a great user experience above,
  and for Vime that user is you, the developer. Vime strives for great DX by:

  - Providing a comprehensive player API. The player is at the root of Vime, thus it is the most interacted
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
  time and effort to making it what it is. Vime strives for great CX by:

  - Being open to all. No special requirements, anyone can be a contributor!
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

- 🧪 &nbsp;**Testing.** We've dedicated extra time and attention to ensuring Vime is tested as much as
  possible. Over 200+ unit tests, UI E2E tests, accessibility tests, and a provider test harness all
  ensure Vime is functioning correctly and up-to-standard. All package releases must go through our
  full suite of tests before being sent out into the wild.
