/// <reference path="../../support/index.d.ts" />

import { PlayerProp } from '../../../src/components/core/player/PlayerProp';
import { PlayerEvent } from '../../../src/components/core/player/PlayerEvent';
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
        Object.values(PlayerEvent).forEach((event: PlayerEvent) => {
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
          if ($player.prop(PlayerProp.PlaybackStarted)) resetPlayer();
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
      cy.wait(200);
    });

    after(() => {
      cy.pause();
    });

    it('should load media', () => {
      cy.player()
        .should(($player) => {
          expect($player.prop(PlayerProp.CurrentSrc)).to.exist.and.is.string;
          expect($player.prop(PlayerProp.MediaType)).to.exist.and.is.string;
          expect($player.prop(PlayerProp.ViewType)).to.exist.and.is.string;
          expect($player.prop(PlayerProp.Duration)).is.greaterThan(0);

          if (!mediaFileProvider.has(provider)) {
            expect($player.prop(PlayerProp.MediaTitle)).to.exist.and.is.string;
          }

          if (provider !== MediaProvider.Audio) {
            expect($player.prop(PlayerProp.CurrentPoster)).to.exist.and.is.string;
          }

          // expect(events[PlayerEvent.LoadStart]).to.have.been.calledOnce;
        });

      cy.wait(500);
      cy.player().toMatchImageSnapshot();
    });

    it('should play', () => {
      cy.play();
      cy.player().should('be.playing');
      cy.player()
        .should(($player) => {
          expect($player.prop(PlayerProp.CurrentTime)).to.be.greaterThan(0);
          expect($player.prop(PlayerProp.Buffered)).to.be.greaterThan(0);
          expect($player.prop(PlayerProp.PlaybackStarted)).to.be.true;
        })
        .and(() => {
          expect(events[PlayerEvent.Play]).to.have.been.calledOnce;
          // Files are loaded too fast on the dev server so they don't always buffer.
          if (!mediaFileProvider.has(provider)) {
            expect(events[PlayerEvent.BufferingChange])
              .to.have.been.calledWith(true)
              .and.to.have.been.calledWith(false);
          }
        })
        .and(() => {
          // order => [paused=false] -> play -> buffering -> playing -> currentTime
          expect(events[PlayerEvent.PausedChange])
            .to.be.calledBefore(events[PlayerEvent.Play]);
          expect(events[PlayerEvent.Play])
            .to.be.calledBefore(events[PlayerEvent.BufferingChange]);
          if (!mediaFileProvider.has(provider)) {
            expect(events[PlayerEvent.BufferingChange])
              .to.be.calledBefore(events[PlayerEvent.PlayingChange]);
          }
          expect(events[PlayerEvent.PlayingChange])
            .to.be.calledBefore(events[PlayerEvent.CurrentTimeChange]);
        });
    });

    it('should pause', () => {
      let currentTime = 0;
      cy.play();
      cy.player().should('be.playing');
      cy.pause();
      cy.player().should('not.be.playing');
      cy.player()
        .should(($player) => { currentTime = $player.prop(PlayerProp.CurrentTime); })
        .wait(150)
        .and(($player) => {
          expect($player.prop(PlayerProp.CurrentTime)).to.be.closeTo(currentTime, 1.5);
        });
    });

    // Audio file loads too fast so the tests fail.
    if (provider !== MediaProvider.Audio) {
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
                from: $player.prop(PlayerProp.CurrentTime),
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

      // @TODO not sure if this test is worth it.
      it.skip('should seek forward while paused', () => {
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
                from: $player.prop(PlayerProp.CurrentTime),
                to: seekTo,
              })
              .and('not.be.buffering')
              .and('not.be.playing')
              .and('have.firedSeekingChange', events);
          });
      });

      // @TODO not sure if this test is worth it.
      it.skip('should seek backward while paused', () => {
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
                from: $player.prop(PlayerProp.CurrentTime),
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
    }

    it('should change volume', () => {
      cy.volume(21);
      cy.player()
        .should(($player) => {
          expect($player.prop(PlayerProp.Volume)).to.eq(21);
          expect($player.prop(PlayerProp.Muted)).to.be.true;
          expect(events[PlayerEvent.MutedChange]).to.not.have.been.called;
        });
    });

    it('should change muted', () => {
      cy.player()
        .should(($player) => {
          const volume = $player.prop(PlayerProp.Volume);
          cy.mute(false);
          cy.player().should(() => {
            expect($player.prop(PlayerProp.Muted)).to.be.false;
            expect($player.prop(PlayerProp.Volume)).to.eq(volume);
          });
        });

      cy.player()
        .should(($player) => {
          const volume = $player.prop(PlayerProp.Volume);
          cy.mute(true);
          cy.player().should(() => {
            expect($player.prop(PlayerProp.Muted)).to.be.true;
            expect($player.prop(PlayerProp.Volume)).to.eq(volume);
            expect(events[PlayerEvent.VolumeChange]).to.not.have.been.calledWith(0);
          });
        });
    });

    // @TODO flaky in CI.
    it.skip('should loop', () => {
      cy.player().then(($player) => { $player.prop(PlayerProp.Loop, true); });
      cy.raf();
      cy.play();
      cy.player().should('be.playing');
      cy.wait(150);
      cy.player().then(($player) => cy.seekTo($player.prop(PlayerProp.Duration) - 2));
      cy.player()
        .should(($player) => {
          expect($player.prop(PlayerProp.Playing)).to.be.true;
          expect($player.prop(PlayerProp.CurrentTime))
            .to.be.greaterThan($player.prop(PlayerProp.Duration) - 2);
        });
      cy.player()
        .should(($player) => {
          expect($player.prop(PlayerProp.PlaybackEnded)).to.be.false;
          expect($player.prop(PlayerProp.CurrentTime)).to.be.lessThan(30).and.greaterThan(0);
        });
    });

    it('should end playback', () => {
      cy.player().then(($player) => { $player.prop(PlayerProp.Loop, false); });
      cy.raf();
      cy.play();
      cy.player().should('be.playing');
      cy.wait(150);
      cy.player().then(($player) => cy.seekTo($player.prop(PlayerProp.Duration) - 2));
      cy.player()
        .should(($player) => {
          expect($player.prop(PlayerProp.PlaybackEnded)).to.be.true;
        });
    });

    // @TODO flaky in CI.
    it.skip('should change playback rate', () => {
      cy.player()
        .then(async ($player) => {
          const canSet = await $player[0].canSetPlaybackRate();
          const rates: number[] = $player.prop(PlayerProp.PlaybackRates);
          const newRate = rates
            .filter((rate) => rate !== 1)[Math.floor(Math.random() * rates.length)];
          if (!canSet || !isNumber(newRate)) return;
          cy.play();
          cy.player().should('be.playing');
          cy.playbackRate(newRate);
          cy.player()
            .should(() => {
              expect(events[PlayerEvent.PlaybackRateChange]).to.have.been.calledWith(newRate);
            });
          let startTime = 0;
          cy.player().then(() => { startTime = $player.prop(PlayerProp.CurrentTime); });
          cy.wait(1000);
          cy.pause();
          cy.player()
            .should('not.be.playing')
            .and(() => {
              const newTime = $player.prop(PlayerProp.CurrentTime);
              const expectedTime = startTime + (1 + (1 * newRate));
              expect(newTime).to.be.closeTo(expectedTime, 1 + (3 * newRate));
              expect($player.prop(PlayerProp.PlaybackRate)).to.eq(newRate);
            });
        });
    });

    // @TODO flaky in CI.
    it.skip('should change playback quality', () => {
      cy.play();
      cy.player().should('be.playing');
      cy.player()
        .then(async ($player) => {
          const canSet = await $player[0].canSetPlaybackQuality();
          const qualities: string[] = $player.prop(PlayerProp.PlaybackQualities);
          if (!canSet || qualities.length === 0) return;
          const newQuality = (qualities[Math.floor(Math.random() * qualities.length)]);
          if (isUndefined(newQuality)) return;
          cy.playbackQuality(newQuality);
          cy.player()
            .should(() => { expect($player.prop(PlayerProp.PlaybackQuality)).to.eq(newQuality); })
            .and('be.playing');
        });
    });

    // @TODO wait for Cypress to support native events.
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

    // @TODO wait for Cypress to support native events.
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

    // @TODO flaky test when set programtically, seems to work fine manually.
    it.skip('should seek before playback starts', () => {
      resetPlayerIfNeeded();
      const seekTo = 60;
      cy.seekTo(seekTo);
      cy.player().should('have.seekedForwards', { from: 0, to: seekTo });
      cy.player()
        .should('not.be.buffering')
        .and('be.playing');
    });

    // @TODO flaky in CI.
    it.skip('should autoplay', () => {
      resetPlayerIfNeeded();
      cy.player().then(($player) => { $player.prop(PlayerProp.Autoplay, true); });
      cy.raf();
      cy.player().should('not.be.buffering').and('be.playing');
    });
  });
};
