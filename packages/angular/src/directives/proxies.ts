/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@vime/core';


export declare interface VimeAudio extends Components.VimeAudio {}
@ProxyCmp({
  inputs: ['crossOrigin', 'disableRemotePlayback', 'mediaTitle', 'preload']
})
@Component({
  selector: 'vime-audio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['crossOrigin', 'disableRemotePlayback', 'mediaTitle', 'preload']
})
export class VimeAudio {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeCaptionControl extends Components.VimeCaptionControl {}
@ProxyCmp({
  inputs: ['hideIcon', 'hideTooltip', 'keys', 'scale', 'showIcon', 'tooltipDirection']
})
@Component({
  selector: 'vime-caption-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['hideIcon', 'hideTooltip', 'keys', 'scale', 'showIcon', 'tooltipDirection']
})
export class VimeCaptionControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { Captions as ICaptions } from '@vime/core/dist/types/components/ui/captions/captions';
export declare interface VimeCaptions extends Components.VimeCaptions {}
@ProxyCmp({
  inputs: ['controlsHeight', 'hidden']
})
@Component({
  selector: 'vime-captions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['controlsHeight', 'hidden'],
  outputs: ['trackChange', 'cuesChange']
})
export class VimeCaptions {
  /** Emitted when the current track changes. */
  trackChange!: ICaptions['trackChange'];
  /** Emitted when the active cues change. A cue is active when
`currentTime >= cue.startTime && currentTime <= cue.endTime`. */
  cuesChange!: ICaptions['cuesChange'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['trackChange', 'cuesChange']);
  }
}


export declare interface VimeClickToPlay extends Components.VimeClickToPlay {}
@ProxyCmp({
  inputs: ['useOnMobile']
})
@Component({
  selector: 'vime-click-to-play',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['useOnMobile']
})
export class VimeClickToPlay {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { Control as IControl } from '@vime/core/dist/types/components/ui/controls/control/control';
export declare interface VimeControl extends Components.VimeControl {}
@ProxyCmp({
  inputs: ['expanded', 'hidden', 'identifier', 'keys', 'label', 'menu', 'pressed', 'scale']
})
@Component({
  selector: 'vime-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['expanded', 'hidden', 'identifier', 'keys', 'label', 'menu', 'pressed', 'scale'],
  outputs: ['interactionChange']
})
export class VimeControl {
  /** Emitted when the user is interacting with the control by focusing, touching or hovering on it. */
  interactionChange!: IControl['interactionChange'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['interactionChange']);
  }
}


export declare interface VimeControlGroup extends Components.VimeControlGroup {}
@ProxyCmp({
  inputs: ['space']
})
@Component({
  selector: 'vime-control-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['space']
})
export class VimeControlGroup {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeControlSpacer extends Components.VimeControlSpacer {}

@Component({
  selector: 'vime-control-spacer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VimeControlSpacer {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeControls extends Components.VimeControls {}
@ProxyCmp({
  inputs: ['activeDuration', 'align', 'direction', 'fullHeight', 'fullWidth', 'hidden', 'hideOnMouseLeave', 'hideWhenPaused', 'justify', 'pin', 'waitForPlaybackStart']
})
@Component({
  selector: 'vime-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activeDuration', 'align', 'direction', 'fullHeight', 'fullWidth', 'hidden', 'hideOnMouseLeave', 'hideWhenPaused', 'justify', 'pin', 'waitForPlaybackStart']
})
export class VimeControls {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeCurrentTime extends Components.VimeCurrentTime {}
@ProxyCmp({
  inputs: ['alwaysShowHours']
})
@Component({
  selector: 'vime-current-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alwaysShowHours']
})
export class VimeCurrentTime {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeDailymotion extends Components.VimeDailymotion {}
@ProxyCmp({
  inputs: ['color', 'shouldAutoplayQueue', 'showDailymotionLogo', 'showShareButtons', 'showUpNextQueue', 'showVideoInfo', 'syndication', 'videoId']
})
@Component({
  selector: 'vime-dailymotion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'shouldAutoplayQueue', 'showDailymotionLogo', 'showShareButtons', 'showUpNextQueue', 'showVideoInfo', 'syndication', 'videoId']
})
export class VimeDailymotion {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeDash extends Components.VimeDash {}
@ProxyCmp({
  inputs: ['autoPiP', 'config', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'poster', 'preload', 'src', 'version']
})
@Component({
  selector: 'vime-dash',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoPiP', 'config', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'poster', 'preload', 'src', 'version']
})
export class VimeDash {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeDefaultControls extends Components.VimeDefaultControls {}
@ProxyCmp({
  inputs: ['activeDuration', 'hideOnMouseLeave', 'hideWhenPaused', 'waitForPlaybackStart']
})
@Component({
  selector: 'vime-default-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['activeDuration', 'hideOnMouseLeave', 'hideWhenPaused', 'waitForPlaybackStart']
})
export class VimeDefaultControls {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeDefaultSettings extends Components.VimeDefaultSettings {}

@Component({
  selector: 'vime-default-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VimeDefaultSettings {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeDefaultUi extends Components.VimeDefaultUi {}

@Component({
  selector: 'vime-default-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VimeDefaultUi {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { Embed as IEmbed } from '@vime/core/dist/types/components/core/embed/embed';
export declare interface VimeEmbed extends Components.VimeEmbed {}
@ProxyCmp({
  inputs: ['decoder', 'embedSrc', 'mediaTitle', 'origin', 'params', 'preconnections'],
  methods: ['postMessage']
})
@Component({
  selector: 'vime-embed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['decoder', 'embedSrc', 'mediaTitle', 'origin', 'params', 'preconnections'],
  outputs: ['embedSrcChange', 'embedMessage', 'embedLoaded']
})
export class VimeEmbed {
  /** Emitted when the `embedSrc` or `params` props change. The payload contains the `params`
serialized into a query string and appended to `embedSrc`. */
  embedSrcChange!: IEmbed['embedSrcChange'];
  /** Emitted when a new message is received from the embedded player via `postMessage`. */
  embedMessage!: IEmbed['embedMessage'];
  /** Emitted when the embedded player and any new media has loaded. */
  embedLoaded!: IEmbed['embedLoaded'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['embedSrcChange', 'embedMessage', 'embedLoaded']);
  }
}


export declare interface VimeEndTime extends Components.VimeEndTime {}
@ProxyCmp({
  inputs: ['alwaysShowHours']
})
@Component({
  selector: 'vime-end-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alwaysShowHours']
})
export class VimeEndTime {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeFaketube extends Components.VimeFaketube {}
@ProxyCmp({
  methods: ['getAdapter', 'dispatchLoadStart', 'dispatchStateChange']
})
@Component({
  selector: 'vime-faketube',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VimeFaketube {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeFile extends Components.VimeFile {}
@ProxyCmp({
  inputs: ['autoPiP', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'playbackRates', 'poster', 'preload', 'viewType']
})
@Component({
  selector: 'vime-file',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoPiP', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'playbackRates', 'poster', 'preload', 'viewType']
})
export class VimeFile {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeFullscreenControl extends Components.VimeFullscreenControl {}
@ProxyCmp({
  inputs: ['enterIcon', 'exitIcon', 'hideTooltip', 'keys', 'scale', 'tooltipDirection']
})
@Component({
  selector: 'vime-fullscreen-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['enterIcon', 'exitIcon', 'hideTooltip', 'keys', 'scale', 'tooltipDirection']
})
export class VimeFullscreenControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeHls extends Components.VimeHls {}
@ProxyCmp({
  inputs: ['autoPiP', 'config', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'poster', 'preload', 'version']
})
@Component({
  selector: 'vime-hls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoPiP', 'config', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'poster', 'preload', 'version']
})
export class VimeHls {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeIcon extends Components.VimeIcon {}
@ProxyCmp({
  inputs: ['color', 'href', 'opacity', 'scale']
})
@Component({
  selector: 'vime-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['color', 'href', 'opacity', 'scale']
})
export class VimeIcon {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeIcons extends Components.VimeIcons {}
@ProxyCmp({
  inputs: ['href']
})
@Component({
  selector: 'vime-icons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['href']
})
export class VimeIcons {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeLiveIndicator extends Components.VimeLiveIndicator {}

@Component({
  selector: 'vime-live-indicator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VimeLiveIndicator {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { Menu as IMenu } from '@vime/core/dist/types/components/ui/settings/menu/menu';
export declare interface VimeMenu extends Components.VimeMenu {}
@ProxyCmp({
  inputs: ['active', 'controller', 'identifier'],
  methods: ['getController', 'getFocusedMenuItem', 'focusOnOpen']
})
@Component({
  selector: 'vime-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['active', 'controller', 'identifier'],
  outputs: ['open', 'close', 'menuItemsChange', 'focusedMenuItem']
})
export class VimeMenu {
  /** Emitted when the menu is open/active. */
  open!: IMenu['open'];
  /** Emitted when the menu has closed/is not active. */
  close!: IMenu['close'];
  /** Emitted when the menu items present changes. */
  menuItemsChange!: IMenu['menuItemsChange'];
  /** Emitted when the currently focused menu item changes. */
  focusedMenuItem!: IMenu['focusedMenuItem'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['open', 'close', 'menuItemsChange', 'focusedMenuItem']);
  }
}


export declare interface VimeMenuItem extends Components.VimeMenuItem {}
@ProxyCmp({
  inputs: ['badge', 'checked', 'checkedIcon', 'expanded', 'hidden', 'hint', 'identifier', 'label', 'menu']
})
@Component({
  selector: 'vime-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['badge', 'checked', 'checkedIcon', 'expanded', 'hidden', 'hint', 'identifier', 'label', 'menu']
})
export class VimeMenuItem {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { MenuRadio as IMenuRadio } from '@vime/core/dist/types/components/ui/settings/menu-radio/menu-radio';
export declare interface VimeMenuRadio extends Components.VimeMenuRadio {}
@ProxyCmp({
  inputs: ['badge', 'checked', 'checkedIcon', 'label', 'value']
})
@Component({
  selector: 'vime-menu-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['badge', 'checked', 'checkedIcon', 'label', 'value'],
  outputs: ['check']
})
export class VimeMenuRadio {
  /** Emitted when the radio button is selected. */
  check!: IMenuRadio['check'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['check']);
  }
}

import { MenuRadioGroup as IMenuRadioGroup } from '@vime/core/dist/types/components/ui/settings/menu-radio-group/menu-radio-group';
export declare interface VimeMenuRadioGroup extends Components.VimeMenuRadioGroup {}
@ProxyCmp({
  inputs: ['value']
})
@Component({
  selector: 'vime-menu-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['value'],
  outputs: ['check']
})
export class VimeMenuRadioGroup {
  /** Emitted when a new radio button is selected for this group. */
  check!: IMenuRadioGroup['check'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['check']);
  }
}


export declare interface VimeMuteControl extends Components.VimeMuteControl {}
@ProxyCmp({
  inputs: ['hideTooltip', 'highVolumeIcon', 'keys', 'lowVolumeIcon', 'mutedIcon', 'scale', 'tooltipDirection']
})
@Component({
  selector: 'vime-mute-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['hideTooltip', 'highVolumeIcon', 'keys', 'lowVolumeIcon', 'mutedIcon', 'scale', 'tooltipDirection']
})
export class VimeMuteControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimePipControl extends Components.VimePipControl {}
@ProxyCmp({
  inputs: ['enterIcon', 'exitIcon', 'hideTooltip', 'keys', 'scale', 'tooltipDirection']
})
@Component({
  selector: 'vime-pip-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['enterIcon', 'exitIcon', 'hideTooltip', 'keys', 'scale', 'tooltipDirection']
})
export class VimePipControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimePlaybackControl extends Components.VimePlaybackControl {}
@ProxyCmp({
  inputs: ['hideTooltip', 'keys', 'pauseIcon', 'playIcon', 'scale', 'tooltipDirection']
})
@Component({
  selector: 'vime-playback-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['hideTooltip', 'keys', 'pauseIcon', 'playIcon', 'scale', 'tooltipDirection']
})
export class VimePlaybackControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { Player as IPlayer } from '@vime/core/dist/types/components/core/player/player';
export declare interface VimePlayer extends Components.VimePlayer {}
@ProxyCmp({
  inputs: ['aspectRatio', 'autopause', 'autoplay', 'buffered', 'buffering', 'controls', 'currentCaption', 'currentPoster', 'currentSrc', 'currentTime', 'debug', 'duration', 'errors', 'i18n', 'isAudio', 'isAudioView', 'isCaptionsActive', 'isControlsActive', 'isFullscreenActive', 'isLive', 'isMobile', 'isPiPActive', 'isSettingsActive', 'isTouch', 'isVideo', 'isVideoView', 'language', 'languages', 'loop', 'mediaTitle', 'mediaType', 'muted', 'noSkeleton', 'paused', 'playbackEnded', 'playbackQualities', 'playbackQuality', 'playbackRate', 'playbackRates', 'playbackReady', 'playbackStarted', 'playing', 'playsinline', 'seeking', 'textTracks', 'translations', 'viewType', 'volume'],
  methods: ['getProvider', 'play', 'pause', 'canPlay', 'canAutoplay', 'canMutedAutoplay', 'canSetPlaybackRate', 'canSetPlaybackQuality', 'canSetFullscreen', 'enterFullscreen', 'exitFullscreen', 'canSetPiP', 'enterPiP', 'exitPiP', 'extendLanguage']
})
@Component({
  selector: 'vime-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['aspectRatio', 'autopause', 'autoplay', 'buffered', 'buffering', 'controls', 'currentCaption', 'currentPoster', 'currentSrc', 'currentTime', 'debug', 'duration', 'errors', 'i18n', 'isAudio', 'isAudioView', 'isCaptionsActive', 'isControlsActive', 'isFullscreenActive', 'isLive', 'isMobile', 'isPiPActive', 'isSettingsActive', 'isTouch', 'isVideo', 'isVideoView', 'language', 'languages', 'loop', 'mediaTitle', 'mediaType', 'muted', 'noSkeleton', 'paused', 'playbackEnded', 'playbackQualities', 'playbackQuality', 'playbackRate', 'playbackRates', 'playbackReady', 'playbackStarted', 'playing', 'playsinline', 'seeking', 'textTracks', 'translations', 'viewType', 'volume'],
  outputs: ['vPausedChange', 'vPlay', 'vPlayingChange', 'vSeekingChange', 'vSeeked', 'vBufferingChange', 'vDurationChange', 'vCurrentTimeChange', 'vPlaybackReady', 'vPlaybackStarted', 'vPlaybackEnded', 'vBufferedChange', 'vTextTracksChange', 'vErrorsChange', 'vLoadStart', 'vCurrentSrcChange', 'vCurrentPosterChange', 'vMediaTitleChange', 'vControlsChange', 'vPlaybackRateChange', 'vPlaybackRatesChange', 'vPlaybackQualityChange', 'vPlaybackQualitiesChange', 'vMutedChange', 'vVolumeChange', 'vViewTypeChange', 'vMediaTypeChange', 'vLiveChange', 'vTouchChange', 'vLanguageChange', 'vLanguagesChange', 'vFullscreenChange', 'vPiPChange']
})
export class VimePlayer {
  /** Emitted when the `paused` prop changes value. @inheritDoc undefined*/
  vPausedChange!: IPlayer['vPausedChange'];
  /** Emitted when the media is transitioning from `paused` to `playing`. Event flow: `paused` ->
`play` -> `playing`. The media starts `playing` once enough content has buffered to
begin/resume playback. @inheritDoc undefined*/
  vPlay!: IPlayer['vPlay'];
  /** Emitted when the `playing` prop changes value. @inheritDoc undefined*/
  vPlayingChange!: IPlayer['vPlayingChange'];
  /** Emitted when the `seeking` prop changes value. @inheritDoc undefined*/
  vSeekingChange!: IPlayer['vSeekingChange'];
  /** Emitted directly after the player has successfully transitioned/seeked to a new time position.
Event flow: `seeking` -> `seeked`. @inheritDoc undefined*/
  vSeeked!: IPlayer['vSeeked'];
  /** Emitted when the `buffering` prop changes value. @inheritDoc undefined*/
  vBufferingChange!: IPlayer['vBufferingChange'];
  /** Emitted when the `duration` prop changes value. @inheritDoc undefined*/
  vDurationChange!: IPlayer['vDurationChange'];
  /** Emitted when the `currentTime` prop changes value. @inheritDoc undefined*/
  vCurrentTimeChange!: IPlayer['vCurrentTimeChange'];
  /** Emitted when the media is ready to begin playback. The following props are guaranteed to be
defined when this fires: `mediaTitle`, `currentSrc`, `currentPoster`, `duration`, `mediaType`,
`viewType`. @inheritDoc undefined*/
  vPlaybackReady!: IPlayer['vPlaybackReady'];
  /** Emitted when the media initiates playback. @inheritDoc undefined*/
  vPlaybackStarted!: IPlayer['vPlaybackStarted'];
  /** Emitted when playback reaches the end of the media. @inheritDoc undefined*/
  vPlaybackEnded!: IPlayer['vPlaybackEnded'];
  /** Emitted when the `buffered` prop changes value. @inheritDoc undefined*/
  vBufferedChange!: IPlayer['vBufferedChange'];
  /** Emitted when the `textTracks` prop changes value. @inheritDoc undefined*/
  vTextTracksChange!: IPlayer['vTextTracksChange'];
  /** Emitted when the `errors` prop changes value. @inheritDoc undefined*/
  vErrorsChange!: IPlayer['vErrorsChange'];
  /** Emitted when the provider starts loading a media resource. @inheritDoc undefined*/
  vLoadStart!: IPlayer['vLoadStart'];
  /** Emitted when the `currentSrc` prop changes value. @inheritDoc undefined*/
  vCurrentSrcChange!: IPlayer['vCurrentSrcChange'];
  /** Emitted when the `currentPoster` prop changes value. @inheritDoc undefined*/
  vCurrentPosterChange!: IPlayer['vCurrentPosterChange'];
  /** Emitted when the `mediaTitle` prop changes value. @inheritDoc undefined*/
  vMediaTitleChange!: IPlayer['vMediaTitleChange'];
  /** Emitted when the `isControlsActive` prop changes value. @inheritDoc undefined*/
  vControlsChange!: IPlayer['vControlsChange'];
  /** Emitted when the `playbackRate` prop changes value. @inheritDoc undefined*/
  vPlaybackRateChange!: IPlayer['vPlaybackRateChange'];
  /** Emitted when the `playbackRates` prop changes value. @inheritDoc undefined*/
  vPlaybackRatesChange!: IPlayer['vPlaybackRatesChange'];
  /** Emitted when the `playbackQuality` prop changes value. @inheritDoc undefined*/
  vPlaybackQualityChange!: IPlayer['vPlaybackQualityChange'];
  /** Emitted when the `playbackQualities` prop changes value. @inheritDoc undefined*/
  vPlaybackQualitiesChange!: IPlayer['vPlaybackQualitiesChange'];
  /** Emitted when the `muted` prop changes value. @inheritDoc undefined*/
  vMutedChange!: IPlayer['vMutedChange'];
  /** Emitted when the `volume` prop changes value. @inheritDoc undefined*/
  vVolumeChange!: IPlayer['vVolumeChange'];
  /** Emitted when the `viewType` prop changes value. @inheritDoc undefined*/
  vViewTypeChange!: IPlayer['vViewTypeChange'];
  /** Emitted when the `mediaType` prop changes value. @inheritDoc undefined*/
  vMediaTypeChange!: IPlayer['vMediaTypeChange'];
  /** Emitted when the `isLive` prop changes value. @inheritDoc undefined*/
  vLiveChange!: IPlayer['vLiveChange'];
  /** Emitted when the `isTouch` prop changes value. @inheritDoc undefined*/
  vTouchChange!: IPlayer['vTouchChange'];
  /** Emitted when the `language` prop changes value. @inheritDoc undefined*/
  vLanguageChange!: IPlayer['vLanguageChange'];
  /** Emitted when the `languages` prop changes value. @inheritDoc undefined*/
  vLanguagesChange!: IPlayer['vLanguagesChange'];
  /** Emitted when the `isFullscreenActive` prop changes value. @inheritDoc undefined*/
  vFullscreenChange!: IPlayer['vFullscreenChange'];
  /** Emitted when the `isPiPActive` prop changes value. @inheritDoc undefined*/
  vPiPChange!: IPlayer['vPiPChange'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['vPausedChange', 'vPlay', 'vPlayingChange', 'vSeekingChange', 'vSeeked', 'vBufferingChange', 'vDurationChange', 'vCurrentTimeChange', 'vPlaybackReady', 'vPlaybackStarted', 'vPlaybackEnded', 'vBufferedChange', 'vTextTracksChange', 'vErrorsChange', 'vLoadStart', 'vCurrentSrcChange', 'vCurrentPosterChange', 'vMediaTitleChange', 'vControlsChange', 'vPlaybackRateChange', 'vPlaybackRatesChange', 'vPlaybackQualityChange', 'vPlaybackQualitiesChange', 'vMutedChange', 'vVolumeChange', 'vViewTypeChange', 'vMediaTypeChange', 'vLiveChange', 'vTouchChange', 'vLanguageChange', 'vLanguagesChange', 'vFullscreenChange', 'vPiPChange']);
  }
}

import { Poster as IPoster } from '@vime/core/dist/types/components/ui/poster/poster';
export declare interface VimePoster extends Components.VimePoster {}
@ProxyCmp({
  inputs: ['fit']
})
@Component({
  selector: 'vime-poster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['fit'],
  outputs: ['loaded', 'willShow', 'willHide']
})
export class VimePoster {
  /** Emitted when the poster has loaded. */
  loaded!: IPoster['loaded'];
  /** Emitted when the poster will be shown. */
  willShow!: IPoster['willShow'];
  /** Emitted when the poster will be hidden. */
  willHide!: IPoster['willHide'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['loaded', 'willShow', 'willHide']);
  }
}


export declare interface VimeScrim extends Components.VimeScrim {}
@ProxyCmp({
  inputs: ['gradient']
})
@Component({
  selector: 'vime-scrim',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['gradient']
})
export class VimeScrim {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeScrubberControl extends Components.VimeScrubberControl {}
@ProxyCmp({
  inputs: ['alwaysShowHours', 'hideTooltip', 'noKeyboard']
})
@Component({
  selector: 'vime-scrubber-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alwaysShowHours', 'hideTooltip', 'noKeyboard']
})
export class VimeScrubberControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeSettings extends Components.VimeSettings {}
@ProxyCmp({
  inputs: ['active', 'controlsHeight'],
  methods: ['setController']
})
@Component({
  selector: 'vime-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['active', 'controlsHeight']
})
export class VimeSettings {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeSettingsControl extends Components.VimeSettingsControl {}
@ProxyCmp({
  inputs: ['icon', 'tooltipDirection']
})
@Component({
  selector: 'vime-settings-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['icon', 'tooltipDirection']
})
export class VimeSettingsControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { Slider as ISlider } from '@vime/core/dist/types/components/ui/slider/slider';
export declare interface VimeSlider extends Components.VimeSlider {}
@ProxyCmp({
  inputs: ['label', 'max', 'min', 'step', 'value', 'valueText']
})
@Component({
  selector: 'vime-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['label', 'max', 'min', 'step', 'value', 'valueText'],
  outputs: ['valueChange']
})
export class VimeSlider {
  /** Emitted when the value of the underlying `input` field changes. */
  valueChange!: ISlider['valueChange'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['valueChange']);
  }
}

import { Spinner as ISpinner } from '@vime/core/dist/types/components/ui/spinner/spinner';
export declare interface VimeSpinner extends Components.VimeSpinner {}

@Component({
  selector: 'vime-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  outputs: ['willShow', 'willHide']
})
export class VimeSpinner {
  /** Emitted when the spinner will be shown. */
  willShow!: ISpinner['willShow'];
  /** Emitted when the spinner will be hidden. */
  willHide!: ISpinner['willHide'];
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['willShow', 'willHide']);
  }
}


export declare interface VimeSubmenu extends Components.VimeSubmenu {}
@ProxyCmp({
  inputs: ['active', 'hidden', 'hint', 'label']
})
@Component({
  selector: 'vime-submenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['active', 'hidden', 'hint', 'label']
})
export class VimeSubmenu {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeTime extends Components.VimeTime {}
@ProxyCmp({
  inputs: ['alwaysShowHours', 'label', 'seconds']
})
@Component({
  selector: 'vime-time',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alwaysShowHours', 'label', 'seconds']
})
export class VimeTime {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeTimeProgress extends Components.VimeTimeProgress {}
@ProxyCmp({
  inputs: ['alwaysShowHours', 'separator']
})
@Component({
  selector: 'vime-time-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['alwaysShowHours', 'separator']
})
export class VimeTimeProgress {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeTooltip extends Components.VimeTooltip {}
@ProxyCmp({
  inputs: ['active', 'direction', 'hidden', 'position']
})
@Component({
  selector: 'vime-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['active', 'direction', 'hidden', 'position']
})
export class VimeTooltip {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeUi extends Components.VimeUi {}

@Component({
  selector: 'vime-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class VimeUi {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeVideo extends Components.VimeVideo {}
@ProxyCmp({
  inputs: ['autoPiP', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'poster', 'preload']
})
@Component({
  selector: 'vime-video',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['autoPiP', 'controlsList', 'crossOrigin', 'disablePiP', 'disableRemotePlayback', 'mediaTitle', 'poster', 'preload']
})
export class VimeVideo {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeVimeo extends Components.VimeVimeo {}
@ProxyCmp({
  inputs: ['byline', 'color', 'portrait', 'videoId']
})
@Component({
  selector: 'vime-vimeo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['byline', 'color', 'portrait', 'videoId']
})
export class VimeVimeo {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeVolumeControl extends Components.VimeVolumeControl {}
@ProxyCmp({
  inputs: ['hideTooltip', 'highVolumeIcon', 'lowVolumeIcon', 'muteKeys', 'mutedIcon', 'noKeyboard', 'tooltipDirection']
})
@Component({
  selector: 'vime-volume-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['hideTooltip', 'highVolumeIcon', 'lowVolumeIcon', 'muteKeys', 'mutedIcon', 'noKeyboard', 'tooltipDirection']
})
export class VimeVolumeControl {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface VimeYoutube extends Components.VimeYoutube {}
@ProxyCmp({
  inputs: ['cookies', 'showFullscreenControl', 'videoId']
})
@Component({
  selector: 'vime-youtube',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['cookies', 'showFullscreenControl', 'videoId']
})
export class VimeYoutube {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
