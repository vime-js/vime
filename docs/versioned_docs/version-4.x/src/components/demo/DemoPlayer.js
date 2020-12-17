import React, { Fragment } from 'react';
import { 
  Player as VmPlayer, 
  Video as VmVideo, 
  DefaultUi as VmDefaultUi, 
  Youtube as VmYoutube, 
  Vimeo as VmVimeo,
  Dailymotion as VmDailymotion,
  Dash as VmDash,
  Hls as VmHls,
  Audio as VmAudio,
} from '@vime/react';

const poster = 'https://media.vimejs.com/poster.png';

const YouTube = () => (<VmYoutube videoId="DyTCOwB0DVw" />);
const Vimeo = () => (<VmVimeo videoId="411652396" />);
const Dailymotion = () => (<VmDailymotion videoId="k3b11PemcuTrmWvYe0q" />);

const Tracks = () => (
  <Fragment>
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srcLang="en" 
      label="English" 
    />
  </Fragment>
);

const Hls = () => (
  <VmHls crossOrigin="" poster={poster}>
    <source data-src="https://media.vimejs.com/hls/index.m3u8" type="application/x-mpegURL" />
    <Tracks />
  </VmHls>  
);

const Dash = () => (
  <VmDash src="https://media.vimejs.com/mpd/manifest.mpd" poster={poster} />
);

const Audio = () => (
  <VmAudio crossOrigin="">
    <source data-src="https://media.vimejs.com/audio.mp3" type="audio/mp3" />
  </VmAudio>
);

const Video = () => (
  <VmVideo crossOrigin="" poster={poster}>
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <Tracks />
  </VmVideo> 
);

const ProviderMap = {
  audio: <Audio />,
  video: <Video />,
  youtube: <YouTube />,
  vimeo: <Vimeo />,
  dailymotion: <Dailymotion />,
  hls: <Hls />,
  dash: <Dash />,
};

let key = 1;
let prevProvider = 'video';
let prevShowDefaultUi = false;

const genKey = (provider, showDefaultUi) => {
  if (provider === prevProvider && prevShowDefaultUi === showDefaultUi) return;
  key += 1
  prevProvider = provider;
  prevShowDefaultUi = showDefaultUi;
  return key;
}

const DemoPlayer = ({
  color,
  theme,
  provider = 'video',
  showDefaultUi = false,
}) => (
  <VmPlayer 
    key={genKey(provider, showDefaultUi)}
    theme={theme} 
    style={{ '--vm-player-theme': color }} 
    controls={!showDefaultUi}
    noSkeleton
  >
    {ProviderMap[provider]}
    {showDefaultUi && <VmDefaultUi />}
  </VmPlayer>
);

export default DemoPlayer;