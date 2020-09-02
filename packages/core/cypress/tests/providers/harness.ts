/// <reference path="../../support/index.d.ts" />

// @ts-ignore
import { skipOn } from '@cypress/skip-test';
import { initialState, PlayerProp } from '../../../src/components/core/player/PlayerProps';
import { getEventName, PlayerEvent } from '../../../src/components/core/player/PlayerEvents';
import { isNumber, isUndefined } from '../../../src/utils/unit';

export enum MediaProvider {
  Audio = 'audio',
  Video = 'video',
  HLS = 'hls',
  Dash = 'dash',
  YouTube = 'youtube',
  Vimeo = 'vimeo',
  Dailymotion = 'dailymotion',
}

export const mediaFileProvider = new Set([
  MediaProvider.Audio,
  MediaProvider.Video,
  MediaProvider.HLS,
  MediaProvider.Dash,
]);

/**
 * Set of tests that are run on a media provider to ensure most basic functions work. Currently
 * changing `playsinline` and `controls` properties are not tested here. Any ideas on how to
 * test these would be awesome.
 */
export const runTestHarness = (provider: MediaProvider) => {
  const events: Record<PlayerEvent, ReturnType<typeof cy.spy>> = {} as any;

  const listenToEvents = () => {
    cy.player()
      .then(($player) => {
        const playerEvents = (Object.keys(initialState) as PlayerProp[]).map(getEventName);
        playerEvents.push('vPlay', 'vSeeked');
        playerEvents.forEach((event: PlayerEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const listener = { [event]: (_detail: any) => {} };
          events[event] = cy.spy(listener, event);
          $player.off(event);
          $player.on(event, (e) => { listener[event](e.detail); });
        });
      });
  };

  context(`vime-${provider}`, () => {
    const resetPlayer = () => {
      cy.get(`#${provider}`).click();
      cy.player().should('be.readyForPlayback');
    };

    const resetPlayerIfNeeded = () => {
      cy.player()
        .then(($player) => {
          if ($player.prop('playbackStarted')) resetPlayer();
        });
    };

    before(() => {
      cy.visit('providers.html');
      resetPlayer();
    });

    beforeEach(() => {
      listenToEvents();
    });

    afterEach(() => {
      // Need a small delay between tests or else some player commands won't go through.
      cy.wait(300);
    });

    after(() => {
      cy.pause();
    });

    it('should load media', () => {
      cy.player()
        .should(($player) => {
          expect($player.prop('currentSrc')).to.exist.and.is.string;
          expect($player.prop('mediaType')).to.exist.and.is.string;
          expect($player.prop('viewType')).to.exist.and.is.string;
          expect($player.prop('duration')).is.greaterThan(0);

          if (!mediaFileProvider.has(provider)) {
            expect($player.prop('mediaTitle')).to.exist.and.is.string;
          }

          if (provider !== MediaProvider.Audio) {
            expect($player.prop('currentPoster')).to.exist.and.is.string;
          }

          // expect(events['loadStart']).to.have.been.calledOnce;
        });

      cy.wait(500);
      cy.player().toMatchImageSnapshot();
    });

    it('should play', () => {
      cy.play();
      cy.player().should('be.playing');
      cy.player()
        .should(($player) => {
          expect($player.prop('currentTime')).to.be.greaterThan(0);
          expect($player.prop('buffered')).to.be.greaterThan(0);
          expect($player.prop('playbackStarted')).to.be.true;
        });

      // @TODO test flaky in CI with Vimeo/Dailymotion for some unknown reason.
      if ((provider !== MediaProvider.Vimeo) && (provider !== MediaProvider.Dailymotion)) {
        cy.player()
        .should(() => {
          expect(events.vPlay).to.have.been.called;
          // Files are loaded too fast on the dev server so they don't always buffer.
          if (!mediaFileProvider.has(provider)) {
            expect(events.vBufferingChange)
              .to.have.been.calledWith(true)
              .and.to.have.been.calledWith(false);
          }
        })
        .and(() => {
          // order => [paused=false] -> play -> buffering -> playing -> currentTime
          expect(events.vPausedChange)
            .to.be.calledBefore(events.vPlay);
          expect(events.vPlay)
            .to.be.calledBefore(events.vBufferingChange);
          if (!mediaFileProvider.has(provider)) {
            expect(events.vBufferingChange)
              .to.be.calledBefore(events.vPlayingChange);
          }
          expect(events.vPlayingChange)
            .to.be.calledBefore(events.vCurrentTimeChange);
        });
      }
    });

    it('should pause', () => {
      let currentTime = 0;
      cy.play();
      cy.player().should('be.playing');
      cy.pause();
      cy.player().should('not.be.playing');
      cy.player()
        .should(($player) => { currentTime = $player.prop('currentTime'); })
        .wait(150)
        .and(($player) => {
          expect($player.prop('currentTime')).to.be.closeTo(currentTime, 1.5);
        });
    });

    skipOn('headless', () => {
      it('should seek forward during playback', () => {
        const seekTo = 30;
        cy.play();
        cy.player().should('be.playing');
        cy.seekTo(seekTo);
        cy.player()
          .should('have.seekedForwards', { from: 0, to: seekTo })
          .and('not.be.buffering')
          .and('be.playing')
          .and('have.firedSeekingChange', events);
      });

      it('should seek backwards during playback', () => {
        const seekTo = 60;
        const seekFrom = 120;
        cy.play();
        cy.player().should('be.playing');
        cy.seekTo(seekFrom);
        cy.player()
          .then(($player) => {
            cy.player()
              .should('have.seekedForwards', {
                from: $player.prop('currentTime'),
                to: seekFrom,
              });
          });
        cy.seekTo(seekTo);
        cy.player()
          .should('have.seekedBackwards', { from: seekFrom, to: seekTo })
          .and('not.be.buffering')
          .and('be.playing')
          .and('have.firedSeekingChange', events);
      });

      it('should seek forward while paused', () => {
        cy.play();
        cy.player().should('be.playing');
        cy.pause();
        cy.player().should('not.be.playing');
        const seekTo = 160;
        cy.seekTo(seekTo);
        cy.player()
          .then(($player) => {
            cy.player()
              .should('have.seekedForwards', {
                from: $player.prop('currentTime'),
                to: seekTo,
              })
              .and('not.be.buffering')
              .and('not.be.playing')
              .and('have.firedSeekingChange', events);
          });
      });

      it('should seek backward while paused', () => {
        const seekTo = 120;
        const seekFrom = 180;
        cy.play();
        cy.player().should('be.playing');
        cy.pause();
        cy.player().should('not.be.playing');
        cy.seekTo(seekFrom);
        cy.player()
          .then(($player) => {
            cy.player()
              .should('have.seekedForwards', {
                from: $player.prop('currentTime'),
                to: seekFrom,
              });
          });
        cy.seekTo(seekTo);
        cy.player()
          .should('have.seekedBackwards', { from: seekFrom, to: seekTo })
          .and('not.be.buffering')
          .and('not.be.playing')
          .and('have.firedSeekingChange', events);
      });
    });

    it('should change volume', () => {
      cy.volume(21);
      cy.player()
        .should(($player) => {
          expect($player.prop('volume')).to.eq(21);
          expect($player.prop('muted')).to.be.true;
          expect(events.vMutedChange).to.not.have.been.called;
        });
    });

    it('should change muted', () => {
      cy.player()
        .should(($player) => {
          const volume = $player.prop('volume');
          cy.mute(false);
          cy.player().should(() => {
            expect($player.prop('muted')).to.be.false;
            expect($player.prop('volume')).to.eq(volume);
          });
        });

      cy.player()
        .should(($player) => {
          const volume = $player.prop('volume');
          cy.mute(true);
          cy.player().should(() => {
            expect($player.prop('muted')).to.be.true;
            expect($player.prop('volume')).to.eq(volume);
            expect(events.vVolumeChange).to.not.have.been.calledWith(0);
          });
        });
    });

    skipOn('headless', () => {
      it('should loop', () => {
        cy.player().then(($player) => { $player.prop('loop', true); });
        cy.raf();
        cy.play();
        cy.player().should('be.playing');
        cy.wait(150);
        cy.player().then(($player) => cy.seekTo($player.prop('duration') - 2));
        cy.player()
          .should(($player) => {
            expect($player.prop('playing')).to.be.true;
            expect($player.prop('currentTime'))
              .to.be.greaterThan($player.prop('duration') - 2);
          });
        cy.player()
          .should(($player) => {
            expect($player.prop('playbackEnded')).to.be.false;
            expect($player.prop('currentTime')).to.be.lessThan(30).and.greaterThan(0);
          });
      });
    });

    it('should end playback', () => {
      cy.player().then(($player) => { $player.prop('loop', false); });
      cy.raf();
      cy.play();
      cy.player().should('be.playing');
      cy.wait(150);
      cy.player().then(($player) => cy.seekTo($player.prop('duration') - 2));
      cy.player()
        .should(($player) => {
          expect($player.prop('playbackEnded')).to.be.true;
        });
    });

    skipOn('headless', () => {
      it('should change playback rate', () => {
        cy.player()
          .then(async ($player) => {
            const canSet = await $player[0].canSetPlaybackRate();
            const rates: number[] = $player.prop('playbackRates');
            const newRate = rates
              .filter((rate) => rate !== 1)[Math.floor(Math.random() * rates.length)];
            if (!canSet || !isNumber(newRate)) return;
            cy.play();
            cy.player().should('be.playing');
            cy.playbackRate(newRate);
            cy.player()
              .should(() => {
                expect(events.vPlaybackRateChange).to.have.been.calledWith(newRate);
              });
            let startTime = 0;
            cy.player().then(() => { startTime = $player.prop('currentTime'); });
            cy.wait(1000);
            cy.pause();
            cy.player()
              .should('not.be.playing')
              .and(() => {
                const newTime = $player.prop('currentTime');
                const expectedTime = startTime + (1 + (1 * newRate));
                expect(newTime).to.be.closeTo(expectedTime, 1 + (3 * newRate));
                expect($player.prop('playbackRate')).to.eq(newRate);
              });
          });
      });

      it('should change playback quality', () => {
        cy.play();
        cy.player().should('be.playing');
        cy.player()
          .then(async ($player) => {
            const canSet = await $player[0].canSetPlaybackQuality();
            const qualities: string[] = $player.prop('playbackQualities');
            if (!canSet || qualities.length === 0) return;
            const newQuality = (qualities[Math.floor(Math.random() * qualities.length)]);
            if (isUndefined(newQuality)) return;
            cy.playbackQuality(newQuality);
            cy.player()
              .should(() => { expect($player.prop('playbackQuality')).to.eq(newQuality); })
              .and('be.playing');
          });
      });
    });

    // @TODO wait for Cypress to support native events.V
    it.skip('should toggle fullscreen', () => {
      cy.player()
        .then(async ($player) => {
          const canSet = await $player[0].canSetFullscreen();
          const adapter = await $player[0].getAdapter();
          const methodExists = !isUndefined(adapter.enterFullscreen);
          if (!canSet || !methodExists) return;
          cy.play();
          cy.player().should('be.playing');
          await $player[0].callAdapter('enterFullscreen');
          cy.player().should('be.fullscreen');
          cy.document().its('fullscreenElement').should('eq', $player[0]);
          cy.player().should('be.playing');
          cy.exitFullscreen();
          cy.player().should('not.be.fullscreen');
          cy.document().its('fullscreenElement').should('not.eq', $player[0]);
          cy.player().should('be.playing');
        });
    });

    // @TODO wait for Cypress to support native events.V
    it.skip('should toggle picture-in-picture', () => {
      cy.player()
        .then(async ($player) => {
          const canSet = await $player[0].canSetPiP();
          if (!canSet) return;
          cy.play();
          cy.player().should('be.playing');
          cy.enterPiP();
          cy.player().should('be.pip');
          cy.document()
            .its('pictureInPictureElement')
            .should((el) => { expect($player[0].contains(el)).to.be.true; });
          cy.player().should('be.playing');
          cy.exitPiP();
          cy.player().should('not.be.pip');
          cy.document()
            .its('pictureInPictureElement')
            .should((el) => { expect(el).to.not.exist; });
          cy.player().should('be.playing');
        });
    });

    skipOn('headless', () => {
      it('should seek before playback starts', () => {
        resetPlayerIfNeeded();
        const seekTo = 60;
        cy.seekTo(seekTo);
        cy.player().should('have.seekedForwards', { from: 0, to: seekTo });
        cy.player()
          .should('not.be.buffering')
          .and('be.playing');
      });

      it('should autoplay', () => {
        resetPlayerIfNeeded();
        cy.player().then(($player) => { $player.prop('autoplay', true); });
        cy.raf();
        cy.player().should('not.be.buffering').and('be.playing');
      });
    });
  });
};
