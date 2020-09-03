
<script>
import { createEventDispatcher, onMount } from 'svelte';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

export let attached = undefined;
export let logger = undefined;
export let theme = undefined;
export let paused = undefined;
export let playing = undefined;
export let duration = undefined;
export let mediaTitle = undefined;
export let currentSrc = undefined;
export let currentPoster = undefined;
export let currentTime = undefined;
export let autoplay = undefined;
export let ready = undefined;
export let playbackReady = undefined;
export let loop = undefined;
export let muted = undefined;
export let buffered = undefined;
export let playbackRate = undefined;
export let playbackRates = undefined;
export let playbackQuality = undefined;
export let playbackQualities = undefined;
export let seeking = undefined;
export let debug = undefined;
export let playbackStarted = undefined;
export let playbackEnded = undefined;
export let buffering = undefined;
export let controls = undefined;
export let isControlsActive = undefined;
export let errors = undefined;
export let textTracks = undefined;
export let currentCaption = undefined;
export let isCaptionsActive = undefined;
export let isSettingsActive = undefined;
export let volume = undefined;
export let isFullscreenActive = undefined;
export let aspectRatio = undefined;
export let viewType = undefined;
export let isAudioView = undefined;
export let isVideoView = undefined;
export let mediaType = undefined;
export let isAudio = undefined;
export let isVideo = undefined;
export let isLive = undefined;
export let isMobile = undefined;
export let isTouch = undefined;
export let isPiPActive = undefined;
export let autopause = undefined;
export let playsinline = undefined;
export let language = undefined;
export let translations = undefined;
export let languages = undefined;
export let i18n = undefined;

export const getProvider = (...args) => __ref.getProvider(...args);
export const getAdapter = (...args) => __ref.getAdapter(...args);
export const play = (...args) => __ref.play(...args);
export const pause = (...args) => __ref.pause(...args);
export const canPlay = (...args) => __ref.canPlay(...args);
export const canAutoplay = (...args) => __ref.canAutoplay(...args);
export const canMutedAutoplay = (...args) => __ref.canMutedAutoplay(...args);
export const canSetPlaybackRate = (...args) => __ref.canSetPlaybackRate(...args);
export const canSetPlaybackQuality = (...args) => __ref.canSetPlaybackQuality(...args);
export const canSetFullscreen = (...args) => __ref.canSetFullscreen(...args);
export const enterFullscreen = (...args) => __ref.enterFullscreen(...args);
export const exitFullscreen = (...args) => __ref.exitFullscreen(...args);
export const canSetPiP = (...args) => __ref.canSetPiP(...args);
export const enterPiP = (...args) => __ref.enterPiP(...args);
export const exitPiP = (...args) => __ref.exitPiP(...args);
export const extendLanguage = (...args) => __ref.extendLanguage(...args);
export const callAdapter = (...args) => __ref.callAdapter(...args);
export const toggleCaptionsVisibility = (...args) => __ref.toggleCaptionsVisibility(...args);

export const getWebComponent = () => __ref;

onMount(() => { __mounted = true; });

const setProp = (prop, value) => { if (__ref) __ref[prop] = value; };

$: if (__mounted) setProp('logger', logger);
$: if (__mounted) setProp('playbackRates', playbackRates);
$: if (__mounted) setProp('playbackQualities', playbackQualities);
$: if (__mounted) setProp('errors', errors);
$: if (__mounted) setProp('textTracks', textTracks);
$: if (__mounted) setProp('currentCaption', currentCaption);
$: if (__mounted) setProp('translations', translations);
$: if (__mounted) setProp('languages', languages);
$: if (__mounted) setProp('i18n', i18n);

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);
};
</script>

<vime-player 
  attached={attached}
  theme={theme}
  paused={paused}
  playing={playing}
  duration={duration}
  media-title={mediaTitle}
  current-src={currentSrc}
  current-poster={currentPoster}
  current-time={currentTime}
  autoplay={autoplay}
  ready={ready}
  playback-ready={playbackReady}
  loop={loop}
  muted={muted}
  buffered={buffered}
  playback-rate={playbackRate}
  playback-quality={playbackQuality}
  seeking={seeking}
  debug={debug}
  playback-started={playbackStarted}
  playback-ended={playbackEnded}
  buffering={buffering}
  controls={controls}
  is-controls-active={isControlsActive}
  is-captions-active={isCaptionsActive}
  is-settings-active={isSettingsActive}
  volume={volume}
  is-fullscreen-active={isFullscreenActive}
  aspect-ratio={aspectRatio}
  view-type={viewType}
  is-audio-view={isAudioView}
  is-video-view={isVideoView}
  media-type={mediaType}
  is-audio={isAudio}
  is-video={isVideo}
  is-live={isLive}
  is-mobile={isMobile}
  is-touch={isTouch}
  is-pi-p-active={isPiPActive}
  autopause={autopause}
  playsinline={playsinline}
  language={language}
  on:vThemeChange={onEvent}
  on:vPausedChange={onEvent}
  on:vPlay={onEvent}
  on:vPlayingChange={onEvent}
  on:vSeekingChange={onEvent}
  on:vSeeked={onEvent}
  on:vBufferingChange={onEvent}
  on:vDurationChange={onEvent}
  on:vCurrentTimeChange={onEvent}
  on:vAttachedChange={onEvent}
  on:vReady={onEvent}
  on:vPlaybackReady={onEvent}
  on:vPlaybackStarted={onEvent}
  on:vPlaybackEnded={onEvent}
  on:vBufferedChange={onEvent}
  on:vCurrentCaptionChange={onEvent}
  on:vTextTracksChange={onEvent}
  on:vErrorsChange={onEvent}
  on:vLoadStart={onEvent}
  on:vCurrentSrcChange={onEvent}
  on:vCurrentPosterChange={onEvent}
  on:vMediaTitleChange={onEvent}
  on:vControlsChange={onEvent}
  on:vPlaybackRateChange={onEvent}
  on:vPlaybackRatesChange={onEvent}
  on:vPlaybackQualityChange={onEvent}
  on:vPlaybackQualitiesChange={onEvent}
  on:vMutedChange={onEvent}
  on:vVolumeChange={onEvent}
  on:vViewTypeChange={onEvent}
  on:vMediaTypeChange={onEvent}
  on:vLiveChange={onEvent}
  on:vTouchChange={onEvent}
  on:vLanguageChange={onEvent}
  on:vI18nChange={onEvent}
  on:vTranslationsChange={onEvent}
  on:vLanguagesChange={onEvent}
  on:vFullscreenChange={onEvent}
  on:vPiPChange={onEvent}
  bind:this={__ref}
>
  <slot></slot>
</vime-player>
  