/* eslint-disable */

const poster = 'https://media.vimejs.com/poster.png';

const track = `
      <track 
        default 
        kind="subtitles" 
        src="https://media.vimejs.com/subs/english.vtt" 
        srclang="en" 
        label="English" 
      />
`.trim();

const isReact = (lib) => lib === 'react';
const isStencil = (lib) => lib === 'stencil';

const audio = (jsx = false) => `
    <${jsx ? 'Audio' : 'vm-audio'}>
      <source 
        data-src="https://media.vimejs.com/audio.mp3" 
        type="video/mp4"
      />
    </${jsx ? 'Audio' : 'vm-audio'}>
`.trim();

const video = (jsx = false, lib) => `
    <${jsx ? 'Video' : 'vm-video'}
      ${(jsx || isStencil(lib)) ? 'crossOrigin' : 'cross-origin'}
      poster="${poster}"
    >
      <source 
        data-src="https://media.vimejs.com/720p.mp4" 
        type="video/mp4"
      />
      ${track}
    </${jsx ? 'Video' : 'vm-video'}>
`.trim();

const youtube = (jsx = false, lib) => `
    <${jsx ? 'Youtube' : 'vm-youtube'} ${(jsx || isStencil(lib)) ? 'videoId' : 'video-id'}="DyTCOwB0DVw"${(jsx || isStencil(lib)) ? ' />' : '><vm-youtube>'}
`.trim();

const vimeo = (jsx = false, lib) => `
    <${jsx ? 'Vimeo' : 'vm-vimeo'} ${(jsx || isStencil(lib)) ? 'videoId' : 'video-id'}="411652396"${(jsx || isStencil(lib)) ? ' />' : '><vm-vimeo>'}
`.trim();

const dailymotion = (jsx = false, lib) => `
    <${jsx ? 'Dailymotion' : 'vm-dailymotion'} ${(jsx || isStencil(lib)) ? 'videoId' : 'video-id'}="k3b11PemcuTrmWvYe0q"${(jsx || isStencil(lib)) ? ' />' : '><vm-dailymotion>'}
`.trim();

const hls = (jsx = false, lib) => `
    <${jsx ? 'Hls' : 'vm-hls'}
      ${(jsx || isStencil(lib)) ? 'crossOrigin' : 'cross-origin'}
      poster="${poster}"
    >
      <source 
        data-src="https://media.vimejs.com/hls/index.m3u8" 
        type="application/x-mpegURL" 
      />
    </${jsx ? 'Hls' : 'vm-hls'}>  
`.trim();

const dash = (jsx = false, lib) => `
    <${jsx ? 'Dash' : 'vm-dash'} 
      src="https://media.vimejs.com/mpd/manifest.mpd" 
      poster="${poster}"
    ${(jsx || isStencil(lib)) ? '/>' : '><vm-dash>'}
`.trim();

const providers = {
  audio,
  video,
  youtube,
  vimeo,
  hls,
  dash,
  dailymotion,
};

const player = (opts, lib, jsx) => {
  const propIf = (condition, prop) => condition ? `\n    ${prop}` : '';

  const style = (isReact(lib) || isStencil(lib)) 
    ? `style={{ '--vm-player-theme': '${opts.color}' }}` 
    : `style="--vm-player-theme: ${opts.color};"`;

  const controlsProp = propIf(!opts.showDefaultUi, 'controls');
  const themeProp = propIf(opts.showDefaultUi, `theme="${opts.theme}"`);
  const styleProp = propIf(opts.showDefaultUi, style);

  return `
  <${jsx ? 'Player' : 'vm-player'}${controlsProp}${themeProp}${styleProp}
  >
    ${providers[opts.provider || 'video'](jsx, lib)}${opts.showDefaultUi ? `\n\n    ${jsx ? '<DefaultUi />' : `<vm-default-ui${isStencil(lib) ? ' />' : '><vm-default-ui>'}`}` : ''}
  </${jsx ? 'Player' : 'vm-player'}>
`.trim();
}

const providerImports = {
  audio: 'Audio',
  video: 'Video',
  hls: 'Hls',
  dash: 'Dash',
  youtube: 'Youtube',
  vimeo: 'Vimeo',
  dailymotion: 'Dailymotion',
};

const importStmt = (opts, lib) => `import { Player, ${providerImports[opts.provider]}${opts.showDefaultUi ? ', DefaultUi ' : ' '}} from '@vime/${lib}';`;

const reactCode = (opts) => `
import React from 'react';
${importStmt(opts, 'react')}

const Player = () => (
  ${player(opts, 'react', true)}
);
`.trim();

const vueCode = (opts) => `
<template>
  ${player(opts, 'vue', true)}
</template>

<script>
${importStmt(opts, 'vue')}

export default {
  components: {
    Player,
    ${providerImports[opts.provider]}${opts.showDefaultUi ? ',\n    DefaultUi' : ''},
  },
};
</script>
`.trim();

const indentBack = (code) => code.replace(/\n\s\s/gm, '\n')
  .replace(/\s<DefaultUi/gm, '\n  <DefaultUi')
  .replace(/\s<vm-default/gm, '\n  <vm-default');

const indentStencil = (code) => code.replace(/\n\s\s/gm, '\n      ')
  .replace(/\s<DefaultUi/gm, '\n        <DefaultUi')
  .replace(/\s<vm-default/gm, '\n        <vm-default');

const svelteCode = (opts) => `
${indentBack(player(opts, 'svelte', true))}

<script>
${importStmt(opts, 'svelte')}
</script>
`.trim();

const stencilCode = (opts) => `
import { h } from '@stencil/core';

class Player() {
  render() {
    return (
      ${indentStencil(player(opts, 'stencil', false))}
    );
  }
}
`.trim();

const codeBuilder = (opts) => {
  switch (opts.language) {
    case 'html':
      return indentBack(player(opts, 'html', false));
      break;
    case 'react':
      return reactCode(opts);
      break; 
    case 'vue':
      return vueCode(opts);
      break; 
    case 'svelte':
      return svelteCode(opts);
      break; 
    case 'stencil':
      return stencilCode(opts);
      break; 
    case 'angular':
      return indentBack(player(opts, 'angular', false));
      break; 
  }

  return null;
};

export default codeBuilder;