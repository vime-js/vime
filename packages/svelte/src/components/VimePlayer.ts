/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { Components, JSX } from '@vime/core';


interface VimePlayerProps {
  
  /** This property has no role other than scoping CSS selectors. */
  theme?: Components.VimePlayer["theme"]
  
  /** Whether playback should be paused. Defaults to `true` if no media has loaded or playback has
not started. Setting this to `true` will begin/resume playback. */
  paused?: Components.VimePlayer["paused"]
  
  /** `@readonly` Whether media is actively playing back. Defaults to `false` if no media has
loaded or playback has not started. */
  playing?: Components.VimePlayer["playing"]
  
  /** `@readonly` A `double` indicating the total playback length of the media in seconds. Defaults
to `-1` if no media has been loaded. If the media is being streamed live then the duration is
equal to `Infinity`. */
  duration?: Components.VimePlayer["duration"]
  
  /** `@readonly` The title of the current media. Defaults to `undefined` if no media has been
loaded. */
  mediaTitle?: Components.VimePlayer["mediaTitle"]
  
  /** `@readonly` The absolute URL of the media resource that has been chosen. Defaults to
`undefined` if no media has been loaded. */
  currentSrc?: Components.VimePlayer["currentSrc"]
  
  /** `@readonly` The absolute URL of the poster for the current media resource. Defaults to
`undefined` if no media/poster has been loaded. */
  currentPoster?: Components.VimePlayer["currentPoster"]
  
  /** A `double` indicating the current playback time in seconds. Defaults to `0` if the media has
not started to play and has not seeked. Setting this value seeks the media to the new
time. The value can be set to a minimum of `0` and maximum of the total length of the
media (indicated by the duration prop). */
  currentTime?: Components.VimePlayer["currentTime"]
  
  /** Whether playback should automatically begin playing once the media is ready to do so. This
will only work if the browsers `autoplay` policies have been satisfied. It'll generally work
if the player is muted, or the user frequently interacts with your site. You can check
if it's possible to autoplay via the `canAutoplay()` or `canMutedAutoplay()` methods.
Depending on the provider, changing this prop may cause the player to completely reset. */
  autoplay?: Components.VimePlayer["autoplay"]
  
  /** `@readonly` Whether the player has loaded and is ready to be interacted with. */
  ready?: Components.VimePlayer["ready"]
  
  /** `@readonly` Whether the player has mounted the DOM. */
  mounted?: Components.VimePlayer["mounted"]
  
  /** `@readonly` Whether the player has disconnected from the DOM and been destroyed. */
  destroyed?: Components.VimePlayer["destroyed"]
  
  /** `@readonly` Whether media is ready for playback to begin. */
  playbackReady?: Components.VimePlayer["playbackReady"]
  
  /** Whether media should automatically start playing from the beginning every time it ends. */
  loop?: Components.VimePlayer["loop"]
  
  /** Whether the audio is muted or not. */
  muted?: Components.VimePlayer["muted"]
  
  /** `@readonly` The length of the media in seconds that has been downloaded by the browser. */
  buffered?: Components.VimePlayer["buffered"]
  
  /** A `double` indicating the rate at which media is being played back. If the value is `<1` then
playback is slowed down; if `>1` then playback is sped up. Defaults to `1`. The playback rate
can only be set to a rate found in the `playbackRates` prop. Some providers may not
allow changing the playback rate, you can check if it's possible via `canSetPlaybackRate()`. */
  playbackRate?: Components.VimePlayer["playbackRate"]
  
  /** `@readonly` The playback rates available for the current media. */
  playbackRates?: Components.VimePlayer["playbackRates"]
  
  /** Indicates the quality of the media. The value will differ between audio and video. For audio
this might be some combination of the encoding format (AAC, MP3), bitrate in kilobits per
second (kbps) and sample rate in kilohertz (kHZ). For video this will be the number of vertical
pixels it supports. For example, if the video has a resolution of `1920x1080` then the quality
will return `1080p`. Defaults to `undefined` which you can interpret as the quality is unknown.
The quality can only be set to a quality found in the `playbackQualities` prop. Some providers
may not allow changing the quality, you can check if it's possible via
`canSetPlaybackQuality()`. */
  playbackQuality?: Components.VimePlayer["playbackQuality"]
  
  /** `@readonly` The media qualities available for the current media. */
  playbackQualities?: Components.VimePlayer["playbackQualities"]
  
  /** `@readonly` Whether the player is in the process of seeking to a new time position. */
  seeking?: Components.VimePlayer["seeking"]
  
  /** `@readonly` Whether the player is in debug mode and should `console.log` information about
its internal state. */
  debug?: Components.VimePlayer["debug"]
  
  /** `@readonly` Whether the media has initiated playback. In other words it will be true if
`currentTime > 0`. */
  playbackStarted?: Components.VimePlayer["playbackStarted"]
  
  /** `@readonly` Whether media playback has reached the end. In other words it'll be true if
`currentTime === duration`. */
  playbackEnded?: Components.VimePlayer["playbackEnded"]
  
  /** `@readonly` Whether playback has temporarily stopped because of a lack of temporary data. */
  buffering?: Components.VimePlayer["buffering"]
  
  /** Indicates whether a user interface should be shown for controlling the resource. Set this to
`false` when you want to provide your own custom controls, and `true` if you want the current
provider to supply its own default controls. Depending on the provider, changing this prop
may cause the player to completely reset. */
  controls?: Components.VimePlayer["controls"]
  
  /** Whether the controls are currently visible. This is currently only supported by custom
controls. */
  isControlsActive?: Components.VimePlayer["isControlsActive"]
  
  /** `@readonly` A collection of errors that have occurred ordered by `[oldest, ..., newest]`. */
  errors?: Components.VimePlayer["errors"]
  
  /** `@readonly` The text tracks (WebVTT) associated with the current media. */
  textTracks?: Components.VimePlayer["textTracks"]
  
  /** `@readonly` The selected caption/subtitle text track to display. Defaults to `undefined` if
there is none. This does not mean this track is active, only that is the current selection. To
know if it is active, check the `isCaptionsActive` prop. */
  currentCaption?: Components.VimePlayer["currentCaption"]
  
  /** `@readonly` Whether any captions or subtitles are currently showing. */
  isCaptionsActive?: Components.VimePlayer["isCaptionsActive"]
  
  /** `@readonly` Whether the settings menu has been opened and is currently visible. This is
currently only supported by custom settings. */
  isSettingsActive?: Components.VimePlayer["isSettingsActive"]
  
  /** An `int` between `0` (silent) and `100` (loudest) indicating the audio volume. */
  volume?: Components.VimePlayer["volume"]
  
  /** `@readonly` Whether the player is currently in fullscreen mode. */
  isFullscreenActive?: Components.VimePlayer["isFullscreenActive"]
  
  /** The aspect ratio of the player expressed as `width:height` (`16:9`). This is only applied if
the `viewType` is `video` and the player is not in fullscreen mode. */
  aspectRatio?: Components.VimePlayer["aspectRatio"]
  
  /** `@readonly` The type of player view that is being used, whether it's an audio player view or
video player view. Normally if the media type is of audio then the view is of type audio, but
in some cases it might be desirable to show a different view type. For example, when playing
audio with a poster. This is subject to the provider allowing it. Defaults to `undefined`
when no media has been loaded. */
  viewType?: Components.VimePlayer["viewType"]
  
  /** `@readonly` Whether the current view is of type `audio`, shorthand for
`viewType === ViewType.Audio`. */
  isAudioView?: Components.VimePlayer["isAudioView"]
  
  /** `@readonly` Whether the current view is of type `video`, shorthand for
`viewType === ViewType.Video`. */
  isVideoView?: Components.VimePlayer["isVideoView"]
  
  /** `@readonly` The type of media that is currently active, whether it's audio or video. Defaults
to `undefined` when no media has been loaded or the type cannot be determined. */
  mediaType?: Components.VimePlayer["mediaType"]
  
  /** `@readonly` Whether the current media is of type `audio`, shorthand for
`mediaType === MediaType.Audio`. */
  isAudio?: Components.VimePlayer["isAudio"]
  
  /** `@readonly` Whether the current media is of type `video`, shorthand for
`mediaType === MediaType.Video`. */
  isVideo?: Components.VimePlayer["isVideo"]
  
  /** `@readonly` Whether the current media is being broadcast live (`duration === Infinity`). */
  isLive?: Components.VimePlayer["isLive"]
  
  /** `@readonly` Whether the player is in mobile mode. This is determined by parsing
`window.navigator.userAgent`. */
  isMobile?: Components.VimePlayer["isMobile"]
  
  /** `@readonly` Whether the player is in touch mode. This is determined by listening for
mouse/touch events and toggling this value. */
  isTouch?: Components.VimePlayer["isTouch"]
  
  /** `@readonly` Whether the player is currently in picture-in-picture mode. */
  isPiPActive?: Components.VimePlayer["isPiPActive"]
  
  /** Whether the player should automatically pause when another Vime player starts/resumes playback. */
  autopause?: Components.VimePlayer["autopause"]
  
  /** Whether the video is to be played "inline", that is within the element's playback area. Note
that setting this to false does not imply that the video will always be played in fullscreen.
Depending on the provider, changing this prop may cause the player to completely reset. */
  playsinline?: Components.VimePlayer["playsinline"]
  
  /** The current language of the player. This can be any code defined via the `extendLanguage`
method or the default `en`. It's recommended to use an ISO 639-1 code as that'll be used by
Vime when adding new language defaults in the future. */
  language?: Components.VimePlayer["language"]
  
  /** `@readonly` Contains each language and it's respective translation map. */
  translations?: Components.VimePlayer["translations"]
  
  /** `@readonly` The languages that are currently available. You can add new languages via the
`extendLanguage` method. */
  languages?: Components.VimePlayer["languages"]
  
  /** `@readonly` A dictionary of translations for the current language. */
  i18n?: Components.VimePlayer["i18n"]
  
  /** Whether the skeleton loading animation should be shown while media is loading. */
  noSkeleton?: Components.VimePlayer["noSkeleton"]
}

interface VimePlayerEvents {
  
  /** Emitted when the `theme` prop changes value. */
  vThemeChange: Parameters<JSX.VimePlayer["onVThemeChange"]>[0]
  
  /** Emitted when the `paused` prop changes value. */
  vPausedChange: Parameters<JSX.VimePlayer["onVPausedChange"]>[0]
  
  /** Emitted when the media is transitioning from `paused` to `playing`. Event flow: `paused` ->
`play` -> `playing`. The media starts `playing` once enough content has buffered to
begin/resume playback. */
  vPlay: Parameters<JSX.VimePlayer["onVPlay"]>[0]
  
  /** Emitted when the `playing` prop changes value. */
  vPlayingChange: Parameters<JSX.VimePlayer["onVPlayingChange"]>[0]
  
  /** Emitted when the `seeking` prop changes value. */
  vSeekingChange: Parameters<JSX.VimePlayer["onVSeekingChange"]>[0]
  
  /** Emitted directly after the player has successfully transitioned/seeked to a new time position.
Event flow: `seeking` -> `seeked`. */
  vSeeked: Parameters<JSX.VimePlayer["onVSeeked"]>[0]
  
  /** Emitted when the `buffering` prop changes value. */
  vBufferingChange: Parameters<JSX.VimePlayer["onVBufferingChange"]>[0]
  
  /** Emitted when the `duration` prop changes value. */
  vDurationChange: Parameters<JSX.VimePlayer["onVDurationChange"]>[0]
  
  /** Emitted when the `currentTime` prop changes value. */
  vCurrentTimeChange: Parameters<JSX.VimePlayer["onVCurrentTimeChange"]>[0]
  
  /** Emitted when the player has mounted the DOM. */
  vMounted: Parameters<JSX.VimePlayer["onVMounted"]>[0]
  
  /** Emitted when the player has disconnected from the DOM and been destroyed. */
  vDestroyed: Parameters<JSX.VimePlayer["onVDestroyed"]>[0]
  
  /** Emitted when the player has loaded and is ready to be interacted with. */
  vReady: Parameters<JSX.VimePlayer["onVReady"]>[0]
  
  /** Emitted when the media is ready to begin playback. The following props are guaranteed to be
defined when this fires: `mediaTitle`, `currentSrc`, `currentPoster`, `duration`, `mediaType`,
`viewType`. */
  vPlaybackReady: Parameters<JSX.VimePlayer["onVPlaybackReady"]>[0]
  
  /** Emitted when the media initiates playback. */
  vPlaybackStarted: Parameters<JSX.VimePlayer["onVPlaybackStarted"]>[0]
  
  /** Emitted when playback reaches the end of the media. */
  vPlaybackEnded: Parameters<JSX.VimePlayer["onVPlaybackEnded"]>[0]
  
  /** Emitted when the `buffered` prop changes value. */
  vBufferedChange: Parameters<JSX.VimePlayer["onVBufferedChange"]>[0]
  
  /** Emitted when the `textTracks` prop changes value. */
  vTextTracksChange: Parameters<JSX.VimePlayer["onVTextTracksChange"]>[0]
  
  /** Emitted when the `errors` prop changes value. */
  vErrorsChange: Parameters<JSX.VimePlayer["onVErrorsChange"]>[0]
  
  /** Emitted when the provider starts loading a media resource. */
  vLoadStart: Parameters<JSX.VimePlayer["onVLoadStart"]>[0]
  
  /** Emitted when the `currentSrc` prop changes value. */
  vCurrentSrcChange: Parameters<JSX.VimePlayer["onVCurrentSrcChange"]>[0]
  
  /** Emitted when the `currentPoster` prop changes value. */
  vCurrentPosterChange: Parameters<JSX.VimePlayer["onVCurrentPosterChange"]>[0]
  
  /** Emitted when the `mediaTitle` prop changes value. */
  vMediaTitleChange: Parameters<JSX.VimePlayer["onVMediaTitleChange"]>[0]
  
  /** Emitted when the `isControlsActive` prop changes value. */
  vControlsChange: Parameters<JSX.VimePlayer["onVControlsChange"]>[0]
  
  /** Emitted when the `playbackRate` prop changes value. */
  vPlaybackRateChange: Parameters<JSX.VimePlayer["onVPlaybackRateChange"]>[0]
  
  /** Emitted when the `playbackRates` prop changes value. */
  vPlaybackRatesChange: Parameters<JSX.VimePlayer["onVPlaybackRatesChange"]>[0]
  
  /** Emitted when the `playbackQuality` prop changes value. */
  vPlaybackQualityChange: Parameters<JSX.VimePlayer["onVPlaybackQualityChange"]>[0]
  
  /** Emitted when the `playbackQualities` prop changes value. */
  vPlaybackQualitiesChange: Parameters<JSX.VimePlayer["onVPlaybackQualitiesChange"]>[0]
  
  /** Emitted when the `muted` prop changes value. */
  vMutedChange: Parameters<JSX.VimePlayer["onVMutedChange"]>[0]
  
  /** Emitted when the `volume` prop changes value. */
  vVolumeChange: Parameters<JSX.VimePlayer["onVVolumeChange"]>[0]
  
  /** Emitted when the `viewType` prop changes value. */
  vViewTypeChange: Parameters<JSX.VimePlayer["onVViewTypeChange"]>[0]
  
  /** Emitted when the `mediaType` prop changes value. */
  vMediaTypeChange: Parameters<JSX.VimePlayer["onVMediaTypeChange"]>[0]
  
  /** Emitted when the `isLive` prop changes value. */
  vLiveChange: Parameters<JSX.VimePlayer["onVLiveChange"]>[0]
  
  /** Emitted when the `isTouch` prop changes value. */
  vTouchChange: Parameters<JSX.VimePlayer["onVTouchChange"]>[0]
  
  /** Emitted when the `language` prop changes value. */
  vLanguageChange: Parameters<JSX.VimePlayer["onVLanguageChange"]>[0]
  
  /** Emitted when the `languages` prop changes value. */
  vLanguagesChange: Parameters<JSX.VimePlayer["onVLanguagesChange"]>[0]
  
  /** Emitted when the `isFullscreenActive` prop changes value. */
  vFullscreenChange: Parameters<JSX.VimePlayer["onVFullscreenChange"]>[0]
  
  /** Emitted when the `isPiPActive` prop changes value. */
  vPiPChange: Parameters<JSX.VimePlayer["onVPiPChange"]>[0]
}

interface VimePlayerSlots {
  default: any
}
  
/* generated by Svelte v3.24.1 */
import {
	SvelteComponent,
	binding_callbacks,
	create_slot,
	detach,
	element,
	init,
	insert,
	listen,
	run_all,
	safe_not_equal,
	set_custom_element_data,
	transition_in,
	transition_out,
	update_slot
} from "svelte/internal";

import { createEventDispatcher, onMount } from "svelte";

function create_fragment(ctx) {
	let vime_player;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*$$slots*/ ctx[74].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[73], null);

	return {
		c() {
			vime_player = element("vime-player");
			if (default_slot) default_slot.c();
			set_custom_element_data(vime_player, "theme", /*theme*/ ctx[0]);
			set_custom_element_data(vime_player, "paused", /*paused*/ ctx[1]);
			set_custom_element_data(vime_player, "playing", /*playing*/ ctx[2]);
			set_custom_element_data(vime_player, "duration", /*duration*/ ctx[3]);
			set_custom_element_data(vime_player, "media-title", /*mediaTitle*/ ctx[4]);
			set_custom_element_data(vime_player, "current-src", /*currentSrc*/ ctx[5]);
			set_custom_element_data(vime_player, "current-poster", /*currentPoster*/ ctx[6]);
			set_custom_element_data(vime_player, "current-time", /*currentTime*/ ctx[7]);
			set_custom_element_data(vime_player, "autoplay", /*autoplay*/ ctx[8]);
			set_custom_element_data(vime_player, "ready", /*ready*/ ctx[9]);
			set_custom_element_data(vime_player, "mounted", /*mounted*/ ctx[10]);
			set_custom_element_data(vime_player, "destroyed", /*destroyed*/ ctx[11]);
			set_custom_element_data(vime_player, "playback-ready", /*playbackReady*/ ctx[12]);
			set_custom_element_data(vime_player, "loop", /*loop*/ ctx[13]);
			set_custom_element_data(vime_player, "muted", /*muted*/ ctx[14]);
			set_custom_element_data(vime_player, "buffered", /*buffered*/ ctx[15]);
			set_custom_element_data(vime_player, "playback-rate", /*playbackRate*/ ctx[16]);
			set_custom_element_data(vime_player, "playback-quality", /*playbackQuality*/ ctx[17]);
			set_custom_element_data(vime_player, "seeking", /*seeking*/ ctx[18]);
			set_custom_element_data(vime_player, "debug", /*debug*/ ctx[19]);
			set_custom_element_data(vime_player, "playback-started", /*playbackStarted*/ ctx[20]);
			set_custom_element_data(vime_player, "playback-ended", /*playbackEnded*/ ctx[21]);
			set_custom_element_data(vime_player, "buffering", /*buffering*/ ctx[22]);
			set_custom_element_data(vime_player, "controls", /*controls*/ ctx[23]);
			set_custom_element_data(vime_player, "is-controls-active", /*isControlsActive*/ ctx[24]);
			set_custom_element_data(vime_player, "is-captions-active", /*isCaptionsActive*/ ctx[25]);
			set_custom_element_data(vime_player, "is-settings-active", /*isSettingsActive*/ ctx[26]);
			set_custom_element_data(vime_player, "volume", /*volume*/ ctx[27]);
			set_custom_element_data(vime_player, "is-fullscreen-active", /*isFullscreenActive*/ ctx[28]);
			set_custom_element_data(vime_player, "aspect-ratio", /*aspectRatio*/ ctx[29]);
			set_custom_element_data(vime_player, "view-type", /*viewType*/ ctx[30]);
			set_custom_element_data(vime_player, "is-audio-view", /*isAudioView*/ ctx[31]);
			set_custom_element_data(vime_player, "is-video-view", /*isVideoView*/ ctx[32]);
			set_custom_element_data(vime_player, "media-type", /*mediaType*/ ctx[33]);
			set_custom_element_data(vime_player, "is-audio", /*isAudio*/ ctx[34]);
			set_custom_element_data(vime_player, "is-video", /*isVideo*/ ctx[35]);
			set_custom_element_data(vime_player, "is-live", /*isLive*/ ctx[36]);
			set_custom_element_data(vime_player, "is-mobile", /*isMobile*/ ctx[37]);
			set_custom_element_data(vime_player, "is-touch", /*isTouch*/ ctx[38]);
			set_custom_element_data(vime_player, "is-pi-p-active", /*isPiPActive*/ ctx[39]);
			set_custom_element_data(vime_player, "autopause", /*autopause*/ ctx[40]);
			set_custom_element_data(vime_player, "playsinline", /*playsinline*/ ctx[41]);
			set_custom_element_data(vime_player, "language", /*language*/ ctx[42]);
			set_custom_element_data(vime_player, "no-skeleton", /*noSkeleton*/ ctx[43]);
		},
		m(target, anchor) {
			insert(target, vime_player, anchor);

			if (default_slot) {
				default_slot.m(vime_player, null);
			}

			/*vime_player_binding*/ ctx[75](vime_player);
			current = true;

			if (!mounted) {
				dispose = [
					listen(vime_player, "vThemeChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPausedChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlay", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlayingChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vSeekingChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vSeeked", /*onEvent*/ ctx[45]),
					listen(vime_player, "vBufferingChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vDurationChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vCurrentTimeChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vMounted", /*onEvent*/ ctx[45]),
					listen(vime_player, "vDestroyed", /*onEvent*/ ctx[45]),
					listen(vime_player, "vReady", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlaybackReady", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlaybackStarted", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlaybackEnded", /*onEvent*/ ctx[45]),
					listen(vime_player, "vBufferedChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vTextTracksChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vErrorsChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vLoadStart", /*onEvent*/ ctx[45]),
					listen(vime_player, "vCurrentSrcChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vCurrentPosterChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vMediaTitleChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vControlsChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlaybackRateChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlaybackRatesChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlaybackQualityChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPlaybackQualitiesChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vMutedChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vVolumeChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vViewTypeChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vMediaTypeChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vLiveChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vTouchChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vLanguageChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vLanguagesChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vFullscreenChange", /*onEvent*/ ctx[45]),
					listen(vime_player, "vPiPChange", /*onEvent*/ ctx[45])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && dirty[2] & /*$$scope*/ 2048) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[73], dirty, null, null);
				}
			}

			if (!current || dirty[0] & /*theme*/ 1) {
				set_custom_element_data(vime_player, "theme", /*theme*/ ctx[0]);
			}

			if (!current || dirty[0] & /*paused*/ 2) {
				set_custom_element_data(vime_player, "paused", /*paused*/ ctx[1]);
			}

			if (!current || dirty[0] & /*playing*/ 4) {
				set_custom_element_data(vime_player, "playing", /*playing*/ ctx[2]);
			}

			if (!current || dirty[0] & /*duration*/ 8) {
				set_custom_element_data(vime_player, "duration", /*duration*/ ctx[3]);
			}

			if (!current || dirty[0] & /*mediaTitle*/ 16) {
				set_custom_element_data(vime_player, "media-title", /*mediaTitle*/ ctx[4]);
			}

			if (!current || dirty[0] & /*currentSrc*/ 32) {
				set_custom_element_data(vime_player, "current-src", /*currentSrc*/ ctx[5]);
			}

			if (!current || dirty[0] & /*currentPoster*/ 64) {
				set_custom_element_data(vime_player, "current-poster", /*currentPoster*/ ctx[6]);
			}

			if (!current || dirty[0] & /*currentTime*/ 128) {
				set_custom_element_data(vime_player, "current-time", /*currentTime*/ ctx[7]);
			}

			if (!current || dirty[0] & /*autoplay*/ 256) {
				set_custom_element_data(vime_player, "autoplay", /*autoplay*/ ctx[8]);
			}

			if (!current || dirty[0] & /*ready*/ 512) {
				set_custom_element_data(vime_player, "ready", /*ready*/ ctx[9]);
			}

			if (!current || dirty[0] & /*mounted*/ 1024) {
				set_custom_element_data(vime_player, "mounted", /*mounted*/ ctx[10]);
			}

			if (!current || dirty[0] & /*destroyed*/ 2048) {
				set_custom_element_data(vime_player, "destroyed", /*destroyed*/ ctx[11]);
			}

			if (!current || dirty[0] & /*playbackReady*/ 4096) {
				set_custom_element_data(vime_player, "playback-ready", /*playbackReady*/ ctx[12]);
			}

			if (!current || dirty[0] & /*loop*/ 8192) {
				set_custom_element_data(vime_player, "loop", /*loop*/ ctx[13]);
			}

			if (!current || dirty[0] & /*muted*/ 16384) {
				set_custom_element_data(vime_player, "muted", /*muted*/ ctx[14]);
			}

			if (!current || dirty[0] & /*buffered*/ 32768) {
				set_custom_element_data(vime_player, "buffered", /*buffered*/ ctx[15]);
			}

			if (!current || dirty[0] & /*playbackRate*/ 65536) {
				set_custom_element_data(vime_player, "playback-rate", /*playbackRate*/ ctx[16]);
			}

			if (!current || dirty[0] & /*playbackQuality*/ 131072) {
				set_custom_element_data(vime_player, "playback-quality", /*playbackQuality*/ ctx[17]);
			}

			if (!current || dirty[0] & /*seeking*/ 262144) {
				set_custom_element_data(vime_player, "seeking", /*seeking*/ ctx[18]);
			}

			if (!current || dirty[0] & /*debug*/ 524288) {
				set_custom_element_data(vime_player, "debug", /*debug*/ ctx[19]);
			}

			if (!current || dirty[0] & /*playbackStarted*/ 1048576) {
				set_custom_element_data(vime_player, "playback-started", /*playbackStarted*/ ctx[20]);
			}

			if (!current || dirty[0] & /*playbackEnded*/ 2097152) {
				set_custom_element_data(vime_player, "playback-ended", /*playbackEnded*/ ctx[21]);
			}

			if (!current || dirty[0] & /*buffering*/ 4194304) {
				set_custom_element_data(vime_player, "buffering", /*buffering*/ ctx[22]);
			}

			if (!current || dirty[0] & /*controls*/ 8388608) {
				set_custom_element_data(vime_player, "controls", /*controls*/ ctx[23]);
			}

			if (!current || dirty[0] & /*isControlsActive*/ 16777216) {
				set_custom_element_data(vime_player, "is-controls-active", /*isControlsActive*/ ctx[24]);
			}

			if (!current || dirty[0] & /*isCaptionsActive*/ 33554432) {
				set_custom_element_data(vime_player, "is-captions-active", /*isCaptionsActive*/ ctx[25]);
			}

			if (!current || dirty[0] & /*isSettingsActive*/ 67108864) {
				set_custom_element_data(vime_player, "is-settings-active", /*isSettingsActive*/ ctx[26]);
			}

			if (!current || dirty[0] & /*volume*/ 134217728) {
				set_custom_element_data(vime_player, "volume", /*volume*/ ctx[27]);
			}

			if (!current || dirty[0] & /*isFullscreenActive*/ 268435456) {
				set_custom_element_data(vime_player, "is-fullscreen-active", /*isFullscreenActive*/ ctx[28]);
			}

			if (!current || dirty[0] & /*aspectRatio*/ 536870912) {
				set_custom_element_data(vime_player, "aspect-ratio", /*aspectRatio*/ ctx[29]);
			}

			if (!current || dirty[0] & /*viewType*/ 1073741824) {
				set_custom_element_data(vime_player, "view-type", /*viewType*/ ctx[30]);
			}

			if (!current || dirty[1] & /*isAudioView*/ 1) {
				set_custom_element_data(vime_player, "is-audio-view", /*isAudioView*/ ctx[31]);
			}

			if (!current || dirty[1] & /*isVideoView*/ 2) {
				set_custom_element_data(vime_player, "is-video-view", /*isVideoView*/ ctx[32]);
			}

			if (!current || dirty[1] & /*mediaType*/ 4) {
				set_custom_element_data(vime_player, "media-type", /*mediaType*/ ctx[33]);
			}

			if (!current || dirty[1] & /*isAudio*/ 8) {
				set_custom_element_data(vime_player, "is-audio", /*isAudio*/ ctx[34]);
			}

			if (!current || dirty[1] & /*isVideo*/ 16) {
				set_custom_element_data(vime_player, "is-video", /*isVideo*/ ctx[35]);
			}

			if (!current || dirty[1] & /*isLive*/ 32) {
				set_custom_element_data(vime_player, "is-live", /*isLive*/ ctx[36]);
			}

			if (!current || dirty[1] & /*isMobile*/ 64) {
				set_custom_element_data(vime_player, "is-mobile", /*isMobile*/ ctx[37]);
			}

			if (!current || dirty[1] & /*isTouch*/ 128) {
				set_custom_element_data(vime_player, "is-touch", /*isTouch*/ ctx[38]);
			}

			if (!current || dirty[1] & /*isPiPActive*/ 256) {
				set_custom_element_data(vime_player, "is-pi-p-active", /*isPiPActive*/ ctx[39]);
			}

			if (!current || dirty[1] & /*autopause*/ 512) {
				set_custom_element_data(vime_player, "autopause", /*autopause*/ ctx[40]);
			}

			if (!current || dirty[1] & /*playsinline*/ 1024) {
				set_custom_element_data(vime_player, "playsinline", /*playsinline*/ ctx[41]);
			}

			if (!current || dirty[1] & /*language*/ 2048) {
				set_custom_element_data(vime_player, "language", /*language*/ ctx[42]);
			}

			if (!current || dirty[1] & /*noSkeleton*/ 4096) {
				set_custom_element_data(vime_player, "no-skeleton", /*noSkeleton*/ ctx[43]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(vime_player);
			if (default_slot) default_slot.d(detaching);
			/*vime_player_binding*/ ctx[75](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let __ref;
	let __mounted = false;
	const dispatch = createEventDispatcher();
	let { theme = undefined } = $$props;
	let { paused = undefined } = $$props;
	let { playing = undefined } = $$props;
	let { duration = undefined } = $$props;
	let { mediaTitle = undefined } = $$props;
	let { currentSrc = undefined } = $$props;
	let { currentPoster = undefined } = $$props;
	let { currentTime = undefined } = $$props;
	let { autoplay = undefined } = $$props;
	let { ready = undefined } = $$props;
	let { mounted = undefined } = $$props;
	let { destroyed = undefined } = $$props;
	let { playbackReady = undefined } = $$props;
	let { loop = undefined } = $$props;
	let { muted = undefined } = $$props;
	let { buffered = undefined } = $$props;
	let { playbackRate = undefined } = $$props;
	let { playbackRates = undefined } = $$props;
	let { playbackQuality = undefined } = $$props;
	let { playbackQualities = undefined } = $$props;
	let { seeking = undefined } = $$props;
	let { debug = undefined } = $$props;
	let { playbackStarted = undefined } = $$props;
	let { playbackEnded = undefined } = $$props;
	let { buffering = undefined } = $$props;
	let { controls = undefined } = $$props;
	let { isControlsActive = undefined } = $$props;
	let { errors = undefined } = $$props;
	let { textTracks = undefined } = $$props;
	let { currentCaption = undefined } = $$props;
	let { isCaptionsActive = undefined } = $$props;
	let { isSettingsActive = undefined } = $$props;
	let { volume = undefined } = $$props;
	let { isFullscreenActive = undefined } = $$props;
	let { aspectRatio = undefined } = $$props;
	let { viewType = undefined } = $$props;
	let { isAudioView = undefined } = $$props;
	let { isVideoView = undefined } = $$props;
	let { mediaType = undefined } = $$props;
	let { isAudio = undefined } = $$props;
	let { isVideo = undefined } = $$props;
	let { isLive = undefined } = $$props;
	let { isMobile = undefined } = $$props;
	let { isTouch = undefined } = $$props;
	let { isPiPActive = undefined } = $$props;
	let { autopause = undefined } = $$props;
	let { playsinline = undefined } = $$props;
	let { language = undefined } = $$props;
	let { translations = undefined } = $$props;
	let { languages = undefined } = $$props;
	let { i18n = undefined } = $$props;
	let { noSkeleton = undefined } = $$props;
	const getProvider = (...args) => __ref.getProvider(...args);
	const getAdapter = (...args) => __ref.getAdapter(...args);
	const play = (...args) => __ref.play(...args);
	const pause = (...args) => __ref.pause(...args);
	const canPlay = (...args) => __ref.canPlay(...args);
	const canAutoplay = (...args) => __ref.canAutoplay(...args);
	const canMutedAutoplay = (...args) => __ref.canMutedAutoplay(...args);
	const canSetPlaybackRate = (...args) => __ref.canSetPlaybackRate(...args);
	const canSetPlaybackQuality = (...args) => __ref.canSetPlaybackQuality(...args);
	const canSetFullscreen = (...args) => __ref.canSetFullscreen(...args);
	const enterFullscreen = (...args) => __ref.enterFullscreen(...args);
	const exitFullscreen = (...args) => __ref.exitFullscreen(...args);
	const canSetPiP = (...args) => __ref.canSetPiP(...args);
	const enterPiP = (...args) => __ref.enterPiP(...args);
	const exitPiP = (...args) => __ref.exitPiP(...args);
	const extendLanguage = (...args) => __ref.extendLanguage(...args);
	const callAdapter = (...args) => __ref.callAdapter(...args);
	const toggleCaptionsVisiblity = (...args) => __ref.toggleCaptionsVisiblity(...args);
	const getWebComponent = () => __ref;

	onMount(() => {
		$$invalidate(76, __mounted = true);
	});

	const setProp = (prop, value) => {
		if (__ref) $$invalidate(44, __ref[prop] = value, __ref);
	};

	const onEvent = e => {
		e.stopPropagation();
		dispatch(e.type, e.detail);
	};

	let { $$slots = {}, $$scope } = $$props;

	function vime_player_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			__ref = $$value;
			$$invalidate(44, __ref);
		});
	}

	$$self.$$set = $$props => {
		if ("theme" in $$props) $$invalidate(0, theme = $$props.theme);
		if ("paused" in $$props) $$invalidate(1, paused = $$props.paused);
		if ("playing" in $$props) $$invalidate(2, playing = $$props.playing);
		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
		if ("mediaTitle" in $$props) $$invalidate(4, mediaTitle = $$props.mediaTitle);
		if ("currentSrc" in $$props) $$invalidate(5, currentSrc = $$props.currentSrc);
		if ("currentPoster" in $$props) $$invalidate(6, currentPoster = $$props.currentPoster);
		if ("currentTime" in $$props) $$invalidate(7, currentTime = $$props.currentTime);
		if ("autoplay" in $$props) $$invalidate(8, autoplay = $$props.autoplay);
		if ("ready" in $$props) $$invalidate(9, ready = $$props.ready);
		if ("mounted" in $$props) $$invalidate(10, mounted = $$props.mounted);
		if ("destroyed" in $$props) $$invalidate(11, destroyed = $$props.destroyed);
		if ("playbackReady" in $$props) $$invalidate(12, playbackReady = $$props.playbackReady);
		if ("loop" in $$props) $$invalidate(13, loop = $$props.loop);
		if ("muted" in $$props) $$invalidate(14, muted = $$props.muted);
		if ("buffered" in $$props) $$invalidate(15, buffered = $$props.buffered);
		if ("playbackRate" in $$props) $$invalidate(16, playbackRate = $$props.playbackRate);
		if ("playbackRates" in $$props) $$invalidate(46, playbackRates = $$props.playbackRates);
		if ("playbackQuality" in $$props) $$invalidate(17, playbackQuality = $$props.playbackQuality);
		if ("playbackQualities" in $$props) $$invalidate(47, playbackQualities = $$props.playbackQualities);
		if ("seeking" in $$props) $$invalidate(18, seeking = $$props.seeking);
		if ("debug" in $$props) $$invalidate(19, debug = $$props.debug);
		if ("playbackStarted" in $$props) $$invalidate(20, playbackStarted = $$props.playbackStarted);
		if ("playbackEnded" in $$props) $$invalidate(21, playbackEnded = $$props.playbackEnded);
		if ("buffering" in $$props) $$invalidate(22, buffering = $$props.buffering);
		if ("controls" in $$props) $$invalidate(23, controls = $$props.controls);
		if ("isControlsActive" in $$props) $$invalidate(24, isControlsActive = $$props.isControlsActive);
		if ("errors" in $$props) $$invalidate(48, errors = $$props.errors);
		if ("textTracks" in $$props) $$invalidate(49, textTracks = $$props.textTracks);
		if ("currentCaption" in $$props) $$invalidate(50, currentCaption = $$props.currentCaption);
		if ("isCaptionsActive" in $$props) $$invalidate(25, isCaptionsActive = $$props.isCaptionsActive);
		if ("isSettingsActive" in $$props) $$invalidate(26, isSettingsActive = $$props.isSettingsActive);
		if ("volume" in $$props) $$invalidate(27, volume = $$props.volume);
		if ("isFullscreenActive" in $$props) $$invalidate(28, isFullscreenActive = $$props.isFullscreenActive);
		if ("aspectRatio" in $$props) $$invalidate(29, aspectRatio = $$props.aspectRatio);
		if ("viewType" in $$props) $$invalidate(30, viewType = $$props.viewType);
		if ("isAudioView" in $$props) $$invalidate(31, isAudioView = $$props.isAudioView);
		if ("isVideoView" in $$props) $$invalidate(32, isVideoView = $$props.isVideoView);
		if ("mediaType" in $$props) $$invalidate(33, mediaType = $$props.mediaType);
		if ("isAudio" in $$props) $$invalidate(34, isAudio = $$props.isAudio);
		if ("isVideo" in $$props) $$invalidate(35, isVideo = $$props.isVideo);
		if ("isLive" in $$props) $$invalidate(36, isLive = $$props.isLive);
		if ("isMobile" in $$props) $$invalidate(37, isMobile = $$props.isMobile);
		if ("isTouch" in $$props) $$invalidate(38, isTouch = $$props.isTouch);
		if ("isPiPActive" in $$props) $$invalidate(39, isPiPActive = $$props.isPiPActive);
		if ("autopause" in $$props) $$invalidate(40, autopause = $$props.autopause);
		if ("playsinline" in $$props) $$invalidate(41, playsinline = $$props.playsinline);
		if ("language" in $$props) $$invalidate(42, language = $$props.language);
		if ("translations" in $$props) $$invalidate(51, translations = $$props.translations);
		if ("languages" in $$props) $$invalidate(52, languages = $$props.languages);
		if ("i18n" in $$props) $$invalidate(53, i18n = $$props.i18n);
		if ("noSkeleton" in $$props) $$invalidate(43, noSkeleton = $$props.noSkeleton);
		if ("$$scope" in $$props) $$invalidate(73, $$scope = $$props.$$scope);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[1] & /*playbackRates*/ 32768 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("playbackRates", playbackRates);
		}

		if ($$self.$$.dirty[1] & /*playbackQualities*/ 65536 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("playbackQualities", playbackQualities);
		}

		if ($$self.$$.dirty[1] & /*errors*/ 131072 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("errors", errors);
		}

		if ($$self.$$.dirty[1] & /*textTracks*/ 262144 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("textTracks", textTracks);
		}

		if ($$self.$$.dirty[1] & /*currentCaption*/ 524288 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("currentCaption", currentCaption);
		}

		if ($$self.$$.dirty[1] & /*translations*/ 1048576 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("translations", translations);
		}

		if ($$self.$$.dirty[1] & /*languages*/ 2097152 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("languages", languages);
		}

		if ($$self.$$.dirty[1] & /*i18n*/ 4194304 | $$self.$$.dirty[2] & /*__mounted*/ 16384) {
			$: if (__mounted) setProp("i18n", i18n);
		}
	};

	return [
		theme,
		paused,
		playing,
		duration,
		mediaTitle,
		currentSrc,
		currentPoster,
		currentTime,
		autoplay,
		ready,
		mounted,
		destroyed,
		playbackReady,
		loop,
		muted,
		buffered,
		playbackRate,
		playbackQuality,
		seeking,
		debug,
		playbackStarted,
		playbackEnded,
		buffering,
		controls,
		isControlsActive,
		isCaptionsActive,
		isSettingsActive,
		volume,
		isFullscreenActive,
		aspectRatio,
		viewType,
		isAudioView,
		isVideoView,
		mediaType,
		isAudio,
		isVideo,
		isLive,
		isMobile,
		isTouch,
		isPiPActive,
		autopause,
		playsinline,
		language,
		noSkeleton,
		__ref,
		onEvent,
		playbackRates,
		playbackQualities,
		errors,
		textTracks,
		currentCaption,
		translations,
		languages,
		i18n,
		getProvider,
		getAdapter,
		play,
		pause,
		canPlay,
		canAutoplay,
		canMutedAutoplay,
		canSetPlaybackRate,
		canSetPlaybackQuality,
		canSetFullscreen,
		enterFullscreen,
		exitFullscreen,
		canSetPiP,
		enterPiP,
		exitPiP,
		extendLanguage,
		callAdapter,
		toggleCaptionsVisiblity,
		getWebComponent,
		$$scope,
		$$slots,
		vime_player_binding
	];
}

class VimePlayer extends SvelteComponent {
  $$prop_def: VimePlayerProps;
  $$events_def: VimePlayerEvents;
  $$slot_def: VimePlayerSlots;

  $on<K extends keyof VimePlayerEvents>(type: K, callback: (e: VimePlayerEvents[K]) => any): () => void {
	  return super.$on(type, callback);
	}

  $set($$props: Partial<VimePlayerProps>): void {
	  super.$set($$props);
	}

	constructor(options) {
		super();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				theme: 0,
				paused: 1,
				playing: 2,
				duration: 3,
				mediaTitle: 4,
				currentSrc: 5,
				currentPoster: 6,
				currentTime: 7,
				autoplay: 8,
				ready: 9,
				mounted: 10,
				destroyed: 11,
				playbackReady: 12,
				loop: 13,
				muted: 14,
				buffered: 15,
				playbackRate: 16,
				playbackRates: 46,
				playbackQuality: 17,
				playbackQualities: 47,
				seeking: 18,
				debug: 19,
				playbackStarted: 20,
				playbackEnded: 21,
				buffering: 22,
				controls: 23,
				isControlsActive: 24,
				errors: 48,
				textTracks: 49,
				currentCaption: 50,
				isCaptionsActive: 25,
				isSettingsActive: 26,
				volume: 27,
				isFullscreenActive: 28,
				aspectRatio: 29,
				viewType: 30,
				isAudioView: 31,
				isVideoView: 32,
				mediaType: 33,
				isAudio: 34,
				isVideo: 35,
				isLive: 36,
				isMobile: 37,
				isTouch: 38,
				isPiPActive: 39,
				autopause: 40,
				playsinline: 41,
				language: 42,
				translations: 51,
				languages: 52,
				i18n: 53,
				noSkeleton: 43,
				getProvider: 54,
				getAdapter: 55,
				play: 56,
				pause: 57,
				canPlay: 58,
				canAutoplay: 59,
				canMutedAutoplay: 60,
				canSetPlaybackRate: 61,
				canSetPlaybackQuality: 62,
				canSetFullscreen: 63,
				enterFullscreen: 64,
				exitFullscreen: 65,
				canSetPiP: 66,
				enterPiP: 67,
				exitPiP: 68,
				extendLanguage: 69,
				callAdapter: 70,
				toggleCaptionsVisiblity: 71,
				getWebComponent: 72
			},
			[-1, -1, -1]
		);
	}

	
  /** Returns the current media provider */
 get getProvider(): Components.VimePlayer["getProvider"] {
		return this.$$.ctx[54];
	}

	
  /** Returns the current media provider's adapter. Shorthand for `getProvider().getAdapter()`. */
 get getAdapter(): Components.VimePlayer["getAdapter"] {
		return this.$$.ctx[55];
	}

	
  /** Begins/resumes playback of the media. If this method is called programmatically before the user
has interacted with the player, the promise may be rejected subject to the browser's autoplay
policies. */
 get play(): Components.VimePlayer["play"] {
		return this.$$.ctx[56];
	}

	
  /** Pauses playback of the media. */
 get pause(): Components.VimePlayer["pause"] {
		return this.$$.ctx[57];
	}

	
  /** Determines whether the current provider recognizes, and can play the given type. */
 get canPlay(): Components.VimePlayer["canPlay"] {
		return this.$$.ctx[58];
	}

	
  /** Determines whether the player can start playback of the current media automatically. */
 get canAutoplay(): Components.VimePlayer["canAutoplay"] {
		return this.$$.ctx[59];
	}

	
  /** Determines whether the player can start playback of the current media automatically given the
player is muted. */
 get canMutedAutoplay(): Components.VimePlayer["canMutedAutoplay"] {
		return this.$$.ctx[60];
	}

	
  /** Returns whether the current provider allows setting the `playbackRate` prop. */
 get canSetPlaybackRate(): Components.VimePlayer["canSetPlaybackRate"] {
		return this.$$.ctx[61];
	}

	
  /** Returns whether the current provider allows setting the `playbackQuality` prop. */
 get canSetPlaybackQuality(): Components.VimePlayer["canSetPlaybackQuality"] {
		return this.$$.ctx[62];
	}

	
  /** Returns whether the native browser fullscreen API is available, or the current provider can
toggle fullscreen mode. This does not mean that the operation is guaranteed to be successful,
only that it can be attempted. */
 get canSetFullscreen(): Components.VimePlayer["canSetFullscreen"] {
		return this.$$.ctx[63];
	}

	
  /** Requests to enter fullscreen mode, returning a `Promise` that will resolve if the request is
made, or reject with a reason for failure. This method will first attempt to use the browsers
native fullscreen API, and then fallback to requesting the provider to do it (if available).
Do not rely on a resolved promise to determine if the player is in fullscreen or not. The only
way to be certain is by listening to the `vFullscreenChange` event. Some common reasons for
failure are: the fullscreen API is not available, the request is made when `viewType` is audio,
or the user has not interacted with the page yet. */
 get enterFullscreen(): Components.VimePlayer["enterFullscreen"] {
		return this.$$.ctx[64];
	}

	
  /** Requests to exit fullscreen mode, returning a `Promise` that will resolve if the request is
successful, or reject with a reason for failure. Refer to `enterFullscreen()` for more
information. */
 get exitFullscreen(): Components.VimePlayer["exitFullscreen"] {
		return this.$$.ctx[65];
	}

	
  /** Returns whether the current provider exposes an API for entering and exiting
picture-in-picture mode. This does not mean the operation is guaranteed to be successful, only
that it can be attempted. */
 get canSetPiP(): Components.VimePlayer["canSetPiP"] {
		return this.$$.ctx[66];
	}

	
  /** Request to enter picture-in-picture (PiP) mode, returning a `Promise` that will resolve if
the request is made, or reject with a reason for failure. Do not rely on a resolved promise
to determine if the player is in PiP mode or not. The only way to be certain is by listening
to the `vPiPChange` event. Some common reasons for failure are the same as the reasons for
`enterFullscreen()`. */
 get enterPiP(): Components.VimePlayer["enterPiP"] {
		return this.$$.ctx[67];
	}

	
  /** Request to exit picture-in-picture mode, returns a `Promise` that will resolve if the request
is successful, or reject with a reason for failure. Refer to `enterPiP()` for more
information. */
 get exitPiP(): Components.VimePlayer["exitPiP"] {
		return this.$$.ctx[68];
	}

	
  /** Extends the translation map for a given language. */
 get extendLanguage(): Components.VimePlayer["extendLanguage"] {
		return this.$$.ctx[69];
	}

	
  /**  */
 get callAdapter(): Components.VimePlayer["callAdapter"] {
		return this.$$.ctx[70];
	}

	
  /** Toggles the visibility of the captions. */
 get toggleCaptionsVisiblity(): Components.VimePlayer["toggleCaptionsVisiblity"] {
		return this.$$.ctx[71];
	}

	get getWebComponent(): HTMLVimePlayerElement | undefined {
		return this.$$.ctx[72];
	}
}

export default VimePlayer;