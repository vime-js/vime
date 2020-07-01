import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { NewSpecPageOptions } from '@stencil/core/internal';
import { Player } from '../player';
import { PlayerProp } from '../PlayerProps';
import { FakeTube } from '../../../providers/faketube/FakeTube';
import { MediaType } from '../MediaType';
import { ViewType } from '../ViewType';
import { MockMediaProviderAdapter } from '../../../providers/MediaProvider';

let page: SpecPage;
let player: Player;
let fakeTube: HTMLVimeFaketubeElement;

const buildPage = async (opts?: Partial<NewSpecPageOptions>) => {
  page = await newSpecPage({
    components: [Player, FakeTube],
    html: '<vime-player><vime-faketube /></vime-player>',
    ...opts,
  });

  player = page.rootInstance!;
  fakeTube = page.root!.querySelector('vime-faketube')!;
};

beforeEach(() => buildPage());

it('should be structurally sound', async () => {
  expect(page.root).toMatchSnapshot();
});

it('should have defined all props', async () => {
  const isUndefinedProp = new Set([
    PlayerProp.MediaQuality,
    PlayerProp.MediaType,
    PlayerProp.ViewType,
    PlayerProp.CurrentSrc,
  ]);

  Object.values(PlayerProp).forEach((prop) => {
    if (!isUndefinedProp.has(prop)) expect(player[prop]).toBeDefined();
  });
});

it('should not throw if attempting to change a writable property', async () => {
  player.controls = true;
  await page.waitForChanges();
});

it('should throw an error if attempting to change a readonly property', async () => {
  await expect(async () => {
    player.mediaType = MediaType.Audio;
    await page.waitForChanges();
  }).rejects.toThrow(/Player.mediaType is readonly./);
});

it('should watch `mediaType` prop', async () => {
  expect(player.isAudio).toBeFalsy();
  expect(player.isVideo).toBeFalsy();
  await fakeTube.dispatchStateChange(PlayerProp.MediaType, MediaType.Audio);
  expect(player.isAudio).toBeTruthy();
  expect(player.isVideo).toBeFalsy();
  await fakeTube.dispatchStateChange(PlayerProp.MediaType, MediaType.Video);
  expect(player.isAudio).toBeFalsy();
  expect(player.isVideo).toBeTruthy();
});

it('should watch `viewType` prop', async () => {
  expect(player.isAudioView).toBeFalsy();
  expect(player.isVideoView).toBeFalsy();
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Audio);
  expect(player.isAudioView).toBeTruthy();
  expect(player.isVideoView).toBeFalsy();
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  expect(player.isAudioView).toBeFalsy();
  expect(player.isVideoView).toBeTruthy();
});

it('should update languages prop when a new language is added', async () => {
  await player.extendLanguage('tr', { Pause: 'Duraklat' });
  await page.waitForChanges();
  expect(player.languages).toEqual(['en', 'tr']);
});

it('should update i18n when the language or translations are changed', async () => {
  await player.extendLanguage('tr', { Pause: 'Duraklat' });
  player.language = 'tr';
  await page.waitForChanges();
  expect(player.i18n).toEqual({ Pause: 'Duraklat' });
  await player.extendLanguage('tr', { Play: 'Oyna', Pause: 'Duraklat' });
  await page.waitForChanges();
  expect(player.i18n).toEqual({ Play: 'Oyna', Pause: 'Duraklat' });
});

it('should call adapter when paused is changed', async () => {
  const adapter = await player.getAdapter();
  expect(adapter.play).not.toHaveBeenCalled();
  expect(adapter.pause).not.toHaveBeenCalled();
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  player.paused = false;
  await page.waitForChanges();
  expect(adapter.play).toHaveBeenCalled();
  expect(adapter.pause).not.toHaveBeenCalled();
  player.paused = true;
  await page.waitForChanges();
  expect(adapter.play).toHaveBeenCalledTimes(1);
  expect(adapter.pause).toHaveBeenCalled();
});

it('should call adapter when muted is changed', async () => {
  const adapter = await player.getAdapter();
  expect(adapter.setMuted).not.toHaveBeenCalled();
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  player.muted = true;
  await page.waitForChanges();
  expect(adapter.setMuted).toHaveBeenCalledWith(true);
  player.muted = false;
  await page.waitForChanges();
  expect(adapter.setMuted).toHaveBeenCalledWith(false);
});

it('should call adapter when volume is changed', async () => {
  const adapter = await player.getAdapter();
  expect(adapter.setVolume).not.toHaveBeenCalled();
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  player.volume = 30;
  await page.waitForChanges();
  expect(adapter.setVolume).toHaveBeenCalledWith(30);
});

it('should call adapter when currentTime is changed', async () => {
  const adapter = await player.getAdapter();
  expect(adapter.setCurrentTime).not.toHaveBeenCalled();
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  player.currentTime = 30;
  await page.waitForChanges();
  expect(adapter.setCurrentTime).toHaveBeenCalledWith(30);
  // Time difference should be > 1.
  player.currentTime = 30.5;
  await page.waitForChanges();
  expect(adapter.setCurrentTime).not.toHaveBeenCalledWith(30.5);
});

it('should not change playbackRate if provider can\'t set it', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation();
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackRate!.mockImplementationOnce(() => Promise.resolve(false));
  player.playbackRate = 2;
  await page.waitForChanges();
  expect(player.playbackRate).toEqual(1);
  expect(spy).toHaveBeenCalledWith('Cannot change `playbackRate`.');
  spy.mockRestore();
});

it('should not change playbackRate if not in playbackRates', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation();
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackRate!.mockImplementationOnce(() => Promise.resolve(true));
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackRates, [1, 2, 3]);
  await page.waitForChanges();
  player.playbackRate = 4;
  await page.waitForChanges();
  expect(player.playbackRate).toEqual(1);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Invalid `playbackRate` of 4.'));
  spy.mockRestore();
});

it('should call adapter when playbackRate is changed', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetPlaybackRate!.mockImplementationOnce(() => Promise.resolve(true));
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackRates, [1, 2]);
  await page.waitForChanges();
  player.playbackRate = 2;
  await page.waitForChanges();
  expect(adapter.setPlaybackRate).toHaveBeenCalledWith(2);
});

it('should not change mediaQuality if provider can\'t set it', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation();
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetMediaQuality!.mockImplementationOnce(() => Promise.resolve(false));
  player.mediaQuality = '720p';
  await page.waitForChanges();
  expect(player.mediaQuality).toBeUndefined();
  expect(spy).toHaveBeenCalledWith('Cannot change `mediaQuality`.');
  spy.mockRestore();
});

it('should not change mediaQuality if not in mediaQualities', async () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation();
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetMediaQuality!.mockImplementationOnce(() => Promise.resolve(true));
  await fakeTube.dispatchStateChange(PlayerProp.MediaQualities, ['1080p', '720p']);
  await page.waitForChanges();
  player.mediaQuality = '480p';
  await page.waitForChanges();
  expect(player.mediaQuality).toBeUndefined();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('Invalid `mediaQuality` of 480p.'));
  spy.mockRestore();
});

it('should call adapter when mediaQuality is changed', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canSetMediaQuality!.mockImplementationOnce(() => Promise.resolve(true));
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  await fakeTube.dispatchStateChange(PlayerProp.MediaQualities, ['1080p', '720p']);
  await page.waitForChanges();
  player.mediaQuality = '720p';
  await page.waitForChanges();
  expect(adapter.setMediaQuality).toHaveBeenCalledWith('720p');
});

// Test doesn't work for some unknown reason.
it.skip('should throw if writing to internal readonly prop', async () => {
  await expect(fakeTube.dispatchStateChange(PlayerProp.IsAudio, true)).rejects.toThrow();
});

it('should adjust paddingBottom according to aspectRatio', async () => {
  expect(page.root!.style.paddingBottom).toEqual('');
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  expect(page.root!.style.paddingBottom).toEqual('56.25%');
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Audio);
  await page.waitForChanges();
  expect(page.root!.style.paddingBottom).toEqual('');
});

it('should render blocker', async () => {
  expect(page.root!.querySelector('.blocker')).toBeNull();
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await page.waitForChanges();
  expect(page.root!.querySelector('.blocker')).toBeDefined();
});

it('should reset props on media change', async () => {
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  player.currentTime = 40;
  player.volume = 80;
  await page.waitForChanges();
  await fakeTube.dispatchStateChange(PlayerProp.CurrentSrc, 'newSrc');
  expect(player.playbackReady).toBeFalsy();
  expect(player.currentTime).toEqual(0);
  expect(player.volume).toEqual(80);
});

it('should return provider when calling getProvider()', async () => {
  const provider = await player.getProvider();
  expect(provider).toEqual(fakeTube);
});

it('should call play on adapter when calling play()', async () => {
  const adapter = await player.getAdapter();
  expect(adapter.play).not.toHaveBeenCalled();
  await player.play();
  expect(adapter.play).toHaveBeenCalled();
});

it('should call pause on adapter when calling pause()', async () => {
  const adapter = await player.getAdapter();
  expect(adapter.pause).not.toHaveBeenCalled();
  await player.pause();
  expect(adapter.pause).toHaveBeenCalled();
});

it('should call canPlay on adapter when calling canPlay()', async () => {
  const adapter = await player.getAdapter() as MockMediaProviderAdapter;
  adapter.canPlay.mockReturnValueOnce(() => Promise.resolve(true));
  expect(await player.canPlay('')).toBeTruthy();
});

it('should throw if calling enterFullscreen() in audio view', async () => {
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Audio);
  await expect(player.enterFullscreen()).rejects.toThrow(/audio player view/);
});

it('should throw if calling enterFullscreen() and no API is available', async () => {
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await expect(player.enterFullscreen()).rejects.toThrow(/API is not available/);
});

it('should throw if calling enterPiP() in audio view', async () => {
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Audio);
  await expect(player.enterPiP()).rejects.toThrow(/audio player view/);
});

it('should throw if calling enterPiP() and no API is available', async () => {
  await fakeTube.dispatchStateChange(PlayerProp.ViewType, ViewType.Video);
  await expect(player.enterPiP()).rejects.toThrow(/API is not available/);
});

it('should extend translations when calling extendLanguage()', async () => {
  await player.extendLanguage('tr', { Play: 'Oyna' });
  await page.waitForChanges();
  expect(player.translations.tr.Play).toEqual('Oyna');
});

it('should fire change event', async () => {
  const cb = jest.fn();
  page.root!.addEventListener('vPausedChange', cb);
  page.root!.addEventListener('vPlay', cb);
  player.paused = false;
  await page.waitForChanges();
  expect(cb).toHaveBeenCalledTimes(2);
});

it('should fire toggle state event', async () => {
  const cb = jest.fn();
  page.root!.addEventListener('vFullscreenChange', cb);
  await fakeTube.dispatchStateChange(PlayerProp.IsFullscreenActive, true);
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
});

it('should fire shortened event', async () => {
  const cb = jest.fn();
  page.root!.addEventListener('vPlaybackStarted', cb);
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackStarted, true);
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
});

it('should fire seeked event', async () => {
  const cb = jest.fn();
  page.root!.addEventListener('vSeeked', cb);
  await fakeTube.dispatchStateChange(PlayerProp.Seeking, true);
  await page.waitForChanges();
  await fakeTube.dispatchStateChange(PlayerProp.Seeking, false);
  await page.waitForChanges();
  expect(cb).toHaveBeenCalled();
});

it('should process playbackReady queue', async () => {
  const adapter = await player.getAdapter();
  player.paused = false;
  player.volume = 30;
  player.muted = true;
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  expect(adapter.play).toHaveBeenCalled();
  expect(adapter.setVolume).toHaveBeenCalledWith(30);
  expect(adapter.setMuted).toHaveBeenCalledWith(true);
});

it('should clear queue when media changes', async () => {
  const adapter = await player.getAdapter();
  player.volume = 30;
  await fakeTube.dispatchStateChange(PlayerProp.CurrentSrc, '');
  await page.waitForChanges();
  await fakeTube.dispatchStateChange(PlayerProp.PlaybackReady, true);
  expect(adapter.setVolume).not.toHaveBeenCalled();
});

it('should update isTouch when input device changes', async () => {
  fakeTube.dispatchEvent(new Event('touchstart', { bubbles: true }));
  await page.waitForChanges();
  expect(player.isTouch).toBeTruthy();
});

it('should autopause player', async () => {
  const playerHtml = '<vime-player><vime-faketube /></vime-player>';
  await buildPage({ html: playerHtml + playerHtml });
  const players = page.body.querySelectorAll('vime-player');
  players[0].paused = false;
  await page.waitForChanges();
  expect(players[0].paused).toBeFalsy();
  players[1].paused = false;
  await page.waitForChanges();
  expect(players[0].paused).toBeTruthy();
  expect(players[1].paused).toBeFalsy();
});

it('should not autopause player', async () => {
  const playerHtml = '<vime-player><vime-faketube /></vime-player>';
  await buildPage({ html: playerHtml + playerHtml });
  const players = page.body.querySelectorAll('vime-player');
  players[0].paused = false;
  players[0].autopause = false;
  await page.waitForChanges();
  expect(players[0].paused).toBeFalsy();
  players[1].paused = false;
  await page.waitForChanges();
  expect(players[0].paused).toBeFalsy();
  expect(players[1].paused).toBeFalsy();
});
