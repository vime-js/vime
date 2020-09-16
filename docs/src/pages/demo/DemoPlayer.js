import React, { Fragment } from 'react';
import { 
  VimePlayer, 
  VimeVideo, 
  VimeDefaultUi, 
  VimeYoutube, 
  VimeVimeo,
  VimeDailymotion,
  VimeDash,
  VimeHls,
  VimeAudio,
} from '@vime/react';

const poster = 'https://media.vimejs.com/poster.png';

const YouTube = () => (<VimeYoutube videoId="DyTCOwB0DVw" />);
const Vimeo = () => (<VimeVimeo videoId="411652396" />);
const Dailymotion = () => (<VimeDailymotion videoId="k3b11PemcuTrmWvYe0q" />);

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
  <VimeHls crossOrigin="" poster={poster}>
    <source data-src="https://media.vimejs.com/hls/index.m3u8" type="application/x-mpegURL" />
    <Tracks />
  </VimeHls>  
);

const Dash = () => (
  <VimeDash src="https://media.vimejs.com/mpd/manifest.mpd" poster={poster} />
);

const Audio = () => (
  <VimeAudio crossOrigin="">
    <source data-src="https://media.vimejs.com/audio.mp3" type="audio/mp3" />
  </VimeAudio>
);

const Video = () => (
  <VimeVideo crossOrigin="" poster={poster}>
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <Tracks />
  </VimeVideo> 
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
  <VimePlayer 
    key={genKey(provider, showDefaultUi)}
    theme={theme} 
    style={{ '--player-theme': color }} 
    controls={!showDefaultUi}
    noSkeleton
  >
    {ProviderMap[provider]}
    {showDefaultUi && <VimeDefaultUi />}
  </VimePlayer>
);

export default DemoPlayer;