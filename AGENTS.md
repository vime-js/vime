# Vime agent guide

Vime is end of life: it gets no fixes of any kind, including security fixes, and this repository is archived. Its successor is [Video.js 10](https://github.com/videojs/video.js), from the teams behind Vime, Vidstack, Plyr, Media Chrome, and Video.js. Don't start new projects with Vime or add new Vime code.

## Migrating to Video.js 10

- **Skill:** install the Video.js skill with `npx @videojs/cli agents skills`, or follow https://github.com/videojs/skills.
- **Installation:** read the installation guide for the target package and follow the prompt in its "AI Quickstart" section.
  - `@vime/react`: https://videojs.org/docs/guides/installation/react.md
  - `@vime/core`, `@vime/vue`, `@vime/vue-next`, `@vime/svelte`, `@vime/angular`: https://videojs.org/docs/guides/installation/html.md
- **Concept mapping:** there's no Vime migration guide. Vidstack succeeded Vime, so the Vidstack guide covers the closest concepts (player, providers, layouts, state, events): https://videojs.org/docs/framework/react/guides/migrate-from-vidstack.md or https://videojs.org/docs/framework/html/guides/migrate-from-vidstack.md. Compare its "Known gaps" section with the features the project uses before changing code.
- **Docs:** https://videojs.org/docs/framework/react/llms.txt and https://videojs.org/docs/framework/html/llms.txt index every page as Markdown. Once Video.js is installed, use `node_modules/@videojs/react/docs/llms.txt` or `node_modules/@videojs/html/docs/llms.txt`, which match the installed version.

## Working in this repository

This repository is archived and accepts no changes.
