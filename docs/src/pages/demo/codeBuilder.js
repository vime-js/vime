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

const audio = (jsx = false) => `
    <${jsx ? 'VimeAudio' : 'vime-audio'}>
      <source 
        data-src="https://media.vimejs.com/audio.mp3" 
        type="video/mp4"
      />
    </${jsx ? 'VimeAudio' : 'vime-audio'}>
`.trim();

const video = (jsx = false) => `
    <${jsx ? 'VimeVideo' : 'vime-video'}
      crossOrigin 
      poster="${poster}"
    >
      <source 
        data-src="https://media.vimejs.com/720p.mp4" 
        type="video/mp4"
      />
      ${track}
    </${jsx ? 'VimeVideo' : 'vime-video'}>
`.trim();

const youtube = (jsx = false) => `
    <${jsx ? 'VimeYoutube' : 'vime-youtube'} videoId="DyTCOwB0DVw"${jsx ? ' />' : '></vime-youtube>'}
`.trim();

const vimeo = (jsx = false) => `
    <${jsx ? 'VimeVimeo' : 'vime-vimeo'} videoId="411652396"${jsx ? ' />' : '></vime-vimeo>'}
`.trim();

const dailymotion = (jsx = false) => `
    <${jsx ? 'VimeDailymotion' : 'vime-dailymotion'} videoId="k3b11PemcuTrmWvYe0q"${jsx ? ' />' : '></vime-dailymotion>'}
`.trim();

const hls = (jsx = false) => `
    <${jsx ? 'VimeHls' : 'vime-hls'}
      crossOrigin 
      poster="${poster}"
    >
      <source 
        data-src="https://media.vimejs.com/hls/index.m3u8" 
        type="application/x-mpegURL" 
      />
      ${track}
    </${jsx ? 'VimeHls' : 'vime-hls'}>  
`.trim();

const dash = (jsx = false) => `
    <${jsx ? 'VimeDash' : 'vime-dash'} 
      src="https://media.vimejs.com/mpd/manifest.mpd" 
      poster="${poster}"
    ${jsx ? '/>' : '></vime-dash>'}
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

  const style = (lib === 'react') 
    ? `style={{ '--vm-player-theme': '${opts.color}' }}` 
    : `style="--vm-player-theme: ${opts.color};"`;

  const controlsProp = propIf(!opts.showDefaultUi, 'controls');
  const themeProp = propIf(opts.showDefaultUi, `theme="${opts.theme}"`);
  const styleProp = propIf(opts.showDefaultUi, style);

  return `
  <${jsx ? 'VimePlayer' : 'vime-player'}${controlsProp}${themeProp}${styleProp}
  >
    ${providers[opts.provider || 'video'](jsx)}${opts.showDefaultUi ? `\n\n    ${jsx ? '<VimeDefaultUi />' : '<vime-default-ui></vime-default-ui>'}` : ''}
  </${jsx ? 'VimePlayer' : 'vime-player'}>
`.trim();
}

const providerImports = {
  audio: 'VimeAudio',
  video: 'VimeVideo',
  hls: 'VimeHls',
  dash: 'VimeDash',
  youtube: 'VimeYoutube',
  vimeo: 'VimeVimeo',
  dailymotion: 'VimeDailymotion',
};

const importStmt = (opts, lib) => `import { VimePlayer, ${providerImports[opts.provider]}${opts.showDefaultUi ? ', VimeDefaultUi ' : ' '}} from '@vime/${lib}';`;

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
    VimePlayer,
    ${providerImports[opts.provider]}${opts.showDefaultUi ? ',\n    VimeDefaultUi' : ''},
  },
};
</script>
`.trim();

const indentBack = (code) => code.replace(/\n\s\s/gm, '\n')
  .replace(/\s<VimeDefaultUi/gm, '\n  <VimeDefaultUi')
  .replace(/\s<vime-default/gm, '\n  <vime-default');

const svelteCode = (opts) => `
${indentBack(player(opts, 'svelte', true))}

<script>
${importStmt(opts, 'svelte')}
</script>
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
    case 'angular':
      return indentBack(player(opts, 'angular', false));
      break; 
  }

  return null;
};

export default codeBuilder;