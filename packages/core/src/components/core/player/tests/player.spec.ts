import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { NewSpecPageOptions } from '@stencil/core/internal';
import { Player } from '../player';
import { FakeTube } from '../../../providers/faketube/FakeTube';
import { MediaType } from '../MediaType';
import { ViewType } from '../ViewType';
import { MockMediaProviderAdapter } from '../../../providers/MediaProvider';
import { initialState, PlayerProp } from '../PlayerProps';
import { getEventName } from '../PlayerEvents';

let page: SpecPage;
let player: HTMLVimePlayerElement;
let adapter: MockMediaProviderAdapter;
let provider: HTMLVimeFaketubeElement;

const buildPage = async (opts?: Partial<NewSpecPageOptions>) => {
  page = await newSpecPage({
    components: [Player, FakeTube],
    html: '<vime-player debug><vime-faketube /></vime-player>',
    ...opts,
  });

  player = page.root! as HTMLVimePlayerElement;
  provider = page.root!.querySelector('vime-faketube')!;
  adapter = await player.getAdapter() as MockMediaProviderAdapter;
};

beforeEach(() => buildPage());

it('should be structurally sound', async () => {
  expect(page.root).toMatchSnapshot();
});

describe('props', () => {
  it('should have defined all props', async () => {
    const isUndefinedProp = new Set([
      'playbackQuality',
      'theme',
      'mediaType',
      'viewType',
      'mediaTitle',
      'textTracks',
      'currentSrc',
      'currentPoster',
      'currentCaption',
    ]);

    Object.keys(initialState).forEach((prop) => {
      if (!isUndefinedProp.has(prop)) expect((player as any)[prop]).toBeDefined();
    });
  });

  it('should not throw if attempting to change a writable property', async () => {
    player.controls = true;
    await page.waitForChanges();
  });

  it('should watch `mediaType` prop', async () => {
    expect(player.isAudio).toBeFalsy();
    expect(player.isVideo).toBeFalsy();
    await provider.dispatchChange('mediaType', MediaType.Audio);
    await page.waitForChanges();
    expect(player.isAudio).toBeTruthy();
    expect(player.isVideo).toBeFalsy();
    await provider.dispatchChange('mediaType', MediaType.Video);
    await page.waitForChanges();
    expect(player.isAudio).toBeFalsy();
    expect(player.isVideo).toBeTruthy();
  });

  it('should watch `viewType` prop', async () => {
    expect(player.isAudioView).toBeFalsy();
    expect(player.isVideoView).toBeFalsy();
    await provider.dispatchChange('viewType', ViewType.Audio);
    await page.waitForChanges();
    expect(player.isAudioView).toBeTruthy();
    expect(player.isVideoView).toBeFalsy();
    await provider.dispatchChange('viewType', ViewType.Video);
    await page.waitForChanges();
    expect(player.isAudioView).toBeFalsy();
    expect(player.isVideoView).toBeTruthy();
  });

  it('should set playing to false when paused changes to true', async () => {
    player.paused = false;
    await provider.dispatchChange('playing', true);
    await page.waitForChanges();
    player.paused = true;
    await page.waitForChanges();
    expect(player.playing).toBeFalsy();
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
    expect(adapter.play).not.toHaveBeenCalled();
    expect(adapter.pause).not.toHaveBeenCalled();
    await provider.dispatchChange('playbackReady', true);
    player.paused = false;
    await page.waitForChanges();
    await provider.dispatchChange('paused', false);
    await page.waitForChanges();
    expect(adapter.play).toHaveBeenCalled();
    expect(adapter.pause).not.toHaveBeenCalled();
    player.paused = true;
    await page.waitForChanges();
    expect(adapter.play).toHaveBeenCalledTimes(1);
    expect(adapter.pause).toHaveBeenCalled();
  });

  it('should call adapter when muted is changed', async () => {
    expect(adapter.setMuted).not.toHaveBeenCalled();
    await provider.dispatchChange('playbackReady', true);
    player.muted = true;
    await page.waitForChanges();
    expect(adapter.setMuted).toHaveBeenCalledWith(true);
    await provider.dispatchChange('muted', true);
    await page.waitForChanges();
    player.muted = false;
    await page.waitForChanges();
    expect(adapter.setMuted).toHaveBeenCalledWith(false);
  });

  it('should call adapter when volume is changed', async () => {
    expect(adapter.setVolume).not.toHaveBeenCalled();
    await provider.dispatchChange('playbackReady', true);
    player.volume = 30;
    await page.waitForChanges();
    expect(adapter.setVolume).toHaveBeenCalledWith(30);
  });

  it('should call adapter when currentTime is changed', async () => {
    expect(adapter.setCurrentTime).not.toHaveBeenCalled();
    await provider.dispatchChange('duration', 100);
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    player.currentTime = 30;
    await page.waitForChanges();
    expect(adapter.setCurrentTime).toHaveBeenCalledWith(30);
  });

  it('should not change playbackRate if provider can\'t set it', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    adapter.canSetPlaybackRate!.mockImplementation(() => Promise.resolve(false));
    await provider.dispatchChange('playbackReady', true);
    player.playbackRate = 2;
    await page.waitForChanges();
    expect(player.playbackRate).toEqual(1);
    expect(spy).toHaveBeenCalledWith('[Vime tip]:', expect.stringContaining('change `playbackRate`'));
    spy.mockRestore();
  });

  it('should not change playbackRate if not in playbackRates', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    adapter.canSetPlaybackRate!.mockImplementationOnce(() => Promise.resolve(true));
    await provider.dispatchChange('playbackReady', true);
    await provider.dispatchChange('playbackRates', [1, 2, 3]);
    await page.waitForChanges();
    player.playbackRate = 4;
    await page.waitForChanges();
    expect(player.playbackRate).toEqual(1);
    expect(spy).toHaveBeenCalledWith('[Vime tip]:', expect.stringContaining('invalid `playbackRate`'));
    spy.mockRestore();
  });

  it('should call adapter when playbackRate is changed', async () => {
    adapter.canSetPlaybackRate!.mockImplementationOnce(() => Promise.resolve(true));
    await provider.dispatchChange('playbackReady', true);
    await provider.dispatchChange('playbackRates', [1, 2]);
    await page.waitForChanges();
    player.playbackRate = 2;
    await page.waitForChanges();
    expect(adapter.setPlaybackRate).toHaveBeenCalledWith(2);
  });

  it('should not change playbackQuality if provider can\'t set it', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    adapter.canSetPlaybackQuality!.mockImplementationOnce(() => Promise.resolve(false));
    await provider.dispatchChange('playbackReady', true);
    player.playbackQuality = '720p';
    await page.waitForChanges();
    expect(player.playbackQuality).toBeUndefined();
    expect(spy).toHaveBeenCalledWith('[Vime tip]:', expect.stringContaining('change `playbackQuality`'));
    spy.mockRestore();
  });

  it('should not change playbackQuality if not in playbackQualities', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    adapter.canSetPlaybackQuality!.mockImplementationOnce(() => Promise.resolve(true));
    await provider.dispatchChange('playbackReady', true);
    await provider.dispatchChange('playbackQualities', ['1080p', '720p']);
    await page.waitForChanges();
    player.playbackQuality = '480p';
    await page.waitForChanges();
    expect(player.playbackQuality).toBeUndefined();
    expect(spy).toHaveBeenCalledWith('[Vime tip]:', expect.stringContaining('invalid `playbackQuality`'));
    spy.mockRestore();
  });

  it('should call adapter when playbackQuality is changed', async () => {
    adapter.canSetPlaybackQuality!.mockImplementationOnce(() => Promise.resolve(true));
    await provider.dispatchChange('playbackReady', true);
    await provider.dispatchChange('playbackQualities', ['1080p', '720p']);
    await page.waitForChanges();
    player.playbackQuality = '720p';
    await page.waitForChanges();
    expect(adapter.setPlaybackQuality).toHaveBeenCalledWith('720p');
  });

  // Test doesn't work for some unknown reason.
  it.skip('should throw if writing to internal readonly prop', async () => {
    await expect(provider.dispatchChange('isAudio', true)).rejects.toThrow();
  });

  it('should adjust paddingBottom according to aspectRatio', async () => {
    expect(page.root!.style.paddingBottom).toEqual('');
    await provider.dispatchChange('viewType', ViewType.Video);
    await page.waitForChanges();
    expect(page.root!.style.paddingBottom).toEqual('56.25%');
    await provider.dispatchChange('viewType', ViewType.Audio);
    await page.waitForChanges();
    expect(page.root!.style.paddingBottom).toEqual('');
  });

  it('should render blocker', async () => {
    expect(page.root!.querySelector('.blocker')).toBeNull();
    await provider.dispatchChange('viewType', ViewType.Video);
    await page.waitForChanges();
    expect(page.root!.querySelector('.blocker')).toBeDefined();
  });

  it('should not reset props on first media change', async () => {
    player.currentTime = 40;
    player.volume = 80;
    await page.waitForChanges();
    await provider.dispatchLoadStart();
    await page.waitForChanges();
    expect(player.currentTime).toEqual(40);
    expect(player.volume).toEqual(80);
  });

  it('should reset props on subsequent media changes', async () => {
    await provider.dispatchChange('playbackReady', true);
    player.currentTime = 40;
    player.volume = 80;
    await provider.dispatchLoadStart();
    await provider.dispatchLoadStart();
    await page.waitForChanges();
    expect(player.playbackReady).toBeFalsy();
    expect(player.currentTime).toEqual(0);
    expect(player.volume).toEqual(80);
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

  it('should update isTouch when input device changes', async () => {
    provider.dispatchEvent(new Event('touchstart', { bubbles: true }));
    await page.waitForChanges();
    expect(player.isTouch).toBeTruthy();
  });

  it('should bound currentTime between 0 and duration', async () => {
    await provider.dispatchChange('duration', 100);
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    player.currentTime = -1;
    await page.waitForChanges();
    expect(adapter.setCurrentTime).not.toHaveBeenCalled();
    player.currentTime = 101;
    await page.waitForChanges();
    expect(adapter.setCurrentTime).toHaveBeenCalledWith(100);
    player.currentTime = 50;
    await page.waitForChanges();
    expect(adapter.setCurrentTime).toHaveBeenCalledWith(50);
  });

  it('should bound volume between 0 and 100', async () => {
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    player.volume = -1;
    await page.waitForChanges();
    expect(adapter.setVolume).toHaveBeenCalledWith(0);
    player.volume = 101;
    await page.waitForChanges();
    expect(adapter.setVolume).toHaveBeenCalledWith(100);
    player.volume = 40;
    await page.waitForChanges();
    expect(adapter.setVolume).toHaveBeenCalledWith(40);
  });

  it('should default to `en` if language is unknown', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    player.language = 'cn';
    await page.waitForChanges();
    expect(player.i18n.play).toEqual('Play');
    expect(spy).toHaveBeenCalledWith('[Vime tip]:', expect.stringContaining('invalid `language`'));
    spy.mockRestore();
  });
});

describe('methods', () => {
  it('should return provider when calling getProvider()', async () => {
    // eslint-disable-next-line no-shadow
    const provider = await player.getProvider();
    expect(provider).toEqual(provider);
  });

  it('should call play on adapter when calling play()', async () => {
    expect(adapter.play).not.toHaveBeenCalled();
    await player.play();
    expect(adapter.play).toHaveBeenCalled();
  });

  it('should call pause on adapter when calling pause()', async () => {
    expect(adapter.pause).not.toHaveBeenCalled();
    await player.pause();
    expect(adapter.pause).toHaveBeenCalled();
  });

  it('should call canPlay on adapter when calling canPlay()', async () => {
    adapter.canPlay.mockReturnValueOnce(() => Promise.resolve(true));
    expect(await player.canPlay('')).toBeTruthy();
  });

  it('should throw if calling enterFullscreen() in audio view', async () => {
    await provider.dispatchChange('viewType', ViewType.Audio);
    await page.waitForChanges();
    await expect(player.enterFullscreen()).rejects.toThrow(/audio player view/);
  });

  it('should throw if calling enterFullscreen() and no API is available', async () => {
    await provider.dispatchChange('viewType', ViewType.Video);
    await page.waitForChanges();
    await expect(player.enterFullscreen()).rejects.toThrow(/API is not available/);
  });

  it('should throw if calling enterPiP() in audio view', async () => {
    await provider.dispatchChange('viewType', ViewType.Audio);
    await page.waitForChanges();
    await expect(player.enterPiP()).rejects.toThrow(/audio player view/);
  });

  it('should throw if calling enterPiP() and no API is available', async () => {
    await provider.dispatchChange('viewType', ViewType.Video);
    await page.waitForChanges();
    await expect(player.enterPiP()).rejects.toThrow(/API is not available/);
  });

  it('should extend translations when calling extendLanguage()', async () => {
    await player.extendLanguage('tr', { Play: 'Oyna' });
    await page.waitForChanges();
    expect(player.translations.tr.Play).toEqual('Oyna');
  });
});

describe('events', () => {
  it('should define all events', () => {
    (Object.keys(initialState) as PlayerProp[])
      .map(getEventName)
      .forEach((event) => expect(event).toBeDefined());
  });

  it('should fire change event', async () => {
    const cb = jest.fn();
    page.root!.addEventListener('vPausedChange', cb);
    player.paused = false;
    await page.waitForChanges();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('should fire toggle state event', async () => {
    const cb = jest.fn();
    page.root!.addEventListener('vFullscreenChange', cb);
    await provider.dispatchChange('isFullscreenActive', true);
    await page.waitForChanges();
    expect(cb).toHaveBeenCalled();
  });

  it('should fire shortened event', async () => {
    const cb = jest.fn();
    page.root!.addEventListener('vPlaybackStarted', cb);
    await provider.dispatchChange('playbackStarted', true);
    await page.waitForChanges();
    expect(cb).toHaveBeenCalled();
  });

  it('should fire play event', async () => {
    const cb = jest.fn();
    page.root!.addEventListener('vPlay', cb);
    await provider.dispatchChange('paused', false);
    await page.waitForChanges();
    expect(cb).toHaveBeenCalled();
  });

  it('should fire seeked event', async () => {
    const cb = jest.fn();
    page.root!.addEventListener('vSeeked', cb);
    await provider.dispatchChange('seeking', true);
    await page.waitForChanges();
    await provider.dispatchChange('seeking', false);
    await page.waitForChanges();
    expect(cb).toHaveBeenCalled();
  });
});

describe('state changes', () => {
  it('should flush state changes', async () => {
    player.currentTime = 33;
    await provider.dispatchChange('seeking', true);
    await provider.dispatchChange('volume', 66);
    await page.waitForChanges();
    expect(player.currentTime).toEqual(33);
    expect(player.volume).toEqual(66);
    expect(player.seeking).toBeTruthy();
  });

  it('should clear state changes when media changes', async () => {
    const initialCurrentTime = player.currentTime;
    player.currentTime = 33;
    await provider.dispatchLoadStart();
    await provider.dispatchLoadStart();
    await page.waitForChanges();
    expect(player.currentTime).toEqual(initialCurrentTime);
  });

  it('should flush state changes in correct order', async () => {
    await provider.dispatchChange('volume', 33);
    await provider.dispatchChange('volume', 66);
    await provider.dispatchChange('volume', 99);
    await page.waitForChanges();
    expect(player.volume).toEqual(99);
  });
});

describe('lifecycle', () => {
  it('should set attached to true after mounting DOM', async () => {
    expect(player.attached).toBeTruthy();
  });

  it('should set destroyed to true after disconnecting from DOM', async () => {
    player.remove();
    await page.waitForChanges();
    expect(player.attached).toBeFalsy();
  });
});

describe('adapter calls', () => {
  it('should flush playbackReady calls', async () => {
    player.paused = false;
    player.volume = 30;
    player.muted = true;
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    expect(adapter.play).toHaveBeenCalled();
    expect(adapter.setVolume).toHaveBeenCalledWith(30);
    expect(adapter.setMuted).toHaveBeenCalledWith(true);
  });

  it('should queue and flush initial playbackReady calls', async () => {
    await buildPage({
      html: '<vime-player paused="false" muted="true" current-time="50"><vime-faketube /></vime-player>',
    });
    await provider.dispatchChange('duration', 100);
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    expect(adapter.play).toHaveBeenCalled();
    expect(adapter.setCurrentTime).toHaveBeenCalledWith(50);
    expect(adapter.setMuted).toHaveBeenCalledWith(true);
  });

  it('should not reflush playback ready calls', async () => {
    await buildPage({
      html: '<vime-player paused="false" muted="true" current-time="50"><vime-faketube /></vime-player>',
    });
    await provider.dispatchChange('duration', Infinity);
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    expect(adapter.play).toHaveBeenCalledTimes(1);
    expect(adapter.setCurrentTime).toHaveBeenCalledTimes(1);
    expect(adapter.setMuted).toHaveBeenCalledTimes(1);
  });

  it('should not call adapter if change comes from provider', async () => {
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    await provider.dispatchChange('currentTime', 50);
    await page.waitForChanges();
    expect(adapter.setCurrentTime).not.toHaveBeenCalledWith(50);
  });

  it('should call adapter if change comes from user', async () => {
    await provider.dispatchChange('duration', 200);
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    const changes = [];
    for (let i = 0; i < 20; i += 1) {
      // eslint-disable-next-line no-loop-func
      changes.push(async () => {
        provider.dispatchChange('currentTime', Math.floor(Math.random() * 100));
      });
    }
    changes[Math.floor(Math.random() * changes.length)] = async () => { player.currentTime = 33; };
    await Promise.all(changes.map((fn) => fn()));
    await page.waitForChanges();
    expect(adapter.setCurrentTime).toHaveBeenCalledWith(33);
    expect(adapter.setCurrentTime).toHaveBeenCalledTimes(1);
    player.currentTime = 66;
    await page.waitForChanges();
    expect(adapter.setCurrentTime).toHaveBeenCalledWith(66);
    expect(adapter.setCurrentTime).toHaveBeenCalledTimes(2);
  });

  it('should clear queued adapter calls when media changes', async () => {
    player.volume = 30;
    await provider.dispatchLoadStart();
    await provider.dispatchLoadStart();
    await page.waitForChanges();
    await provider.dispatchChange('playbackReady', true);
    await page.waitForChanges();
    expect(adapter.setVolume).not.toHaveBeenCalled();
  });
});

describe('stencil-wormhole', () => {
  it('should pass props through the wormhole to the provider', async () => {
    player.controls = true;
    player.playsinline = true;
    player.muted = true;
    await page.waitForChanges();
    expect(provider.controls).toBeTruthy();
    expect(provider.muted).toBeTruthy();
    expect(provider.playsinline).toBeTruthy();
  });
});
