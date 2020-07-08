/// <reference path="../../support/index.d.ts" />

import { PlayerProp } from '../../../src/components/core/player/PlayerProp';
import { PlayerEvent } from '../../../src/components/core/player/PlayerEvent';
import { isNumber, isUndefined } from '../../../src/utils/unit';

export enum MediaProvider {
  YouTube = 'youtube',
  Vimeo = 'vimeo',
  Dailymotion = 'Dailymotion',
  File = 'File',
  Hls = 'hls',
  Dash = 'dash',
}

/**
 * Set of tests that are run on a media provider to ensure most basic functions work. Currently 
 * changing `playsinline` and `controls` properties are not tested here. Any ideas on how to 
 * test these would be awesome.
 */
export const runTestHarness = (provider: MediaProvider) => {
  const events: Record<PlayerEvent, ReturnType<typeof cy.spy>> = {} as any;

  const listenToEvents = () => {
    cy.getPlayer()
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
    before(() => {
      cy.visit('providers/tests');
    });

    const resetPlayer = () => {
      cy.get(`#${provider}`).click();
    };

    beforeEach(() => {
      resetPlayer();
      listenToEvents();
      cy.getPlayer().should('be.readyForPlayback');
    });

    it('should load media', () => {
      cy.getPlayer()
        .should(($player) => {
          expect($player.prop(PlayerProp.CurrentSrc)).to.exist.and.is.string;
          expect($player.prop(PlayerProp.CurrentPoster)).to.exist.and.is.string;
          expect($player.prop(PlayerProp.MediaType)).to.exist.and.is.string;
          expect($player.prop(PlayerProp.ViewType)).to.exist.and.is.string;
          expect($player.prop(PlayerProp.Paused)).to.be.true;
          expect($player.prop(PlayerProp.Playing)).to.be.false;
          expect($player.prop(PlayerProp.Duration)).is.greaterThan(0);
          expect(events[PlayerEvent.LoadStart]).to.have.been.calledOnce;
        });

        cy.getPlayer().toMatchImageSnapshot()
    });

    it('should play', () => {
      cy.play();
      cy.getPlayer()
        .should('be.playing')
        .should(($player) => {
          expect($player.prop(PlayerProp.Buffering)).to.be.false;
          expect($player.prop(PlayerProp.CurrentTime)).to.be.greaterThan(0);
          expect($player.prop(PlayerProp.Buffered)).to.be.greaterThan(0);
          expect($player.prop(PlayerProp.PlaybackStarted)).to.be.true;
        })
        .and(() => {
          expect(events[PlayerEvent.Play]).to.have.been.calledOnce;
          expect(events[PlayerEvent.BufferingChange]).to.have.been.called;
        })
        .and(() => {
          // order => [paused=false] -> play -> buffering -> playing -> currentTime
          expect(events[PlayerEvent.PausedChange])
            .to.be.calledBefore(events[PlayerEvent.Play]);
          expect(events[PlayerEvent.Play])
            .to.be.calledBefore(events[PlayerEvent.BufferingChange]);
          expect(events[PlayerEvent.BufferingChange])
            .to.be.calledBefore(events[PlayerEvent.PlayingChange]);
          expect(events[PlayerEvent.PlayingChange])
            .to.be.calledBefore(events[PlayerEvent.CurrentTimeChange]);
        });
    });

    it('should pause', () => {
      let currentTime = 0;
      cy.play();
      cy.getPlayer().should('be.playing');
      cy.pause();
      cy.getPlayer().should('not.be.playing');
      cy.getPlayer()
        .should(($player) => { currentTime = $player.prop(PlayerProp.CurrentTime); })
        .wait(150)
        .and(($player) => { expect($player.prop(PlayerProp.CurrentTime)).to.eq(currentTime); });
    });

    it('should seek before playback starts', () => {
      const seekTo = 30;
      cy.seekTo(seekTo);
      cy.getPlayer()
        .should('have.seekedForwards', { from: 0, to: seekTo })
        .and('have.firedSeekingChange', events)
        .and('not.be.playing');
    });

    it('should seek forward during playback', () => {
      const seekTo = 30;
      cy.play();
      cy.getPlayer().should('be.playing');
      cy.seekTo(seekTo);
      cy.getPlayer()
        .should('have.seekedForwards', { from: 0, to: seekTo })
        .and('have.firedSeekingChange', events)
        .and('be.playing');
    });

    it('should seek backwards during playback', () => {
      const seekTo = 15;
      const seekFrom = 30;
      cy.play();
      cy.getPlayer().should('be.playing');
      cy.seekTo(seekFrom);
      cy.getPlayer().should('have.seekedForwards', { from: 0, to: seekFrom });
      cy.seekTo(seekTo);
      cy.getPlayer()
        .should('have.seekedBackwards', { from: seekFrom, to: seekTo })
        .and('have.firedSeekingChange', events)
        .and('be.playing');
    });

    it('should seek forward while paused', () => {
      cy.play();
      cy.getPlayer().should('be.playing');
      cy.pause();
      cy.getPlayer().should('not.be.playing');
      const seekTo = 30;
      cy.seekTo(seekTo);
      cy.getPlayer()
        .should('have.seekedForwards', { from: 0, to: seekTo })
        .and('have.firedSeekingChange', events)
        .and('not.be.playing');
    });

    it('should seek backward while paused', () => {
      const seekTo = 15;
      const seekFrom = 30;
      cy.play();
      cy.getPlayer().should('be.playing');
      cy.pause();
      cy.getPlayer().should('not.be.playing');
      cy.seekTo(seekFrom);
      cy.getPlayer().should('have.seekedForwards', { from: 0, to: seekFrom });
      cy.seekTo(seekTo);
      cy.getPlayer()
        .should('have.seekedBackwards', { from: seekFrom, to: seekTo })
        .and('have.firedSeekingChange', events)
        .and('not.be.playing');
    });

    it('should change volume', () => {
      cy.volume(30);
      cy.getPlayer()
        .should(($player) => {
          expect($player.prop(PlayerProp.Volume)).to.eq(30);
          expect($player.prop(PlayerProp.Muted)).to.be.true;
          expect(events[PlayerEvent.MutedChange]).to.not.have.been.called;
        });
    });

    it('should change muted', () => {
      cy.mute(false);
      cy.getPlayer()
        .should(($player) => {
          expect($player.prop(PlayerProp.Muted)).to.be.false;
          expect($player.prop(PlayerProp.Volume)).to.eq(50);
        });
      cy.mute(true);
      cy.getPlayer()
        .should(($player) => {
          expect($player.prop(PlayerProp.Muted)).to.be.true;
          expect($player.prop(PlayerProp.Volume)).to.eq(50);
          expect(events[PlayerEvent.VolumeChange]).to.not.have.been.calledWith(0);
        });
    });

    it('should end playback', () => {
      cy.play();
      cy.getPlayer().should('be.playing');
      cy.getPlayer().then(($player) => cy.seekTo($player.prop(PlayerProp.Duration) - 0.5));
      cy.getPlayer()
        .should(($player) => {
          expect($player.prop(PlayerProp.PlaybackEnded)).to.be.true;
        });
    });

    it('should loop', () => {
      cy.getPlayer().then(($player) => { $player.prop(PlayerProp.Loop, true); });
      cy.play();
      cy.getPlayer().should('be.playing');
      cy.getPlayer().then(($player) => cy.seekTo($player.prop(PlayerProp.Duration) - 0.5));
      cy.getPlayer()
        .should(($player) => {
          expect($player.prop(PlayerProp.PlaybackEnded)).to.be.true;
          expect($player.prop(PlayerProp.CurrentTime)).to.be.lessThan(10).and.greaterThan(0);
        });
    });

    it('should change playback rate', () => {
      cy.getPlayer()
        .then(async ($player) => {
          const canSet = await $player[0].canSetPlaybackRate();
          const rates: number[] = $player.prop(PlayerProp.PlaybackRates);
          const newRate = rates[Math.floor(Math.random() * rates.length)];
          if (!canSet || !isNumber(newRate)) return;
          cy.playbackRate(newRate);
          cy.play();
          cy.getPlayer().should('be.playing');
          cy.wait(1000);
          cy.pause();
          cy.getPlayer()
            .should('not.be.playing')
            .and(() => {
              const newTime = $player.prop(PlayerProp.CurrentTime);
              const expectedTime = (newRate > 1 ? 1 : 0) + (1 * newRate);
              expect(newTime).to.be.closeTo(expectedTime, 1.5);
              expect($player.prop(PlayerProp.PlaybackRate)).to.eq(newRate);
            });
        });
    });

    it('should change playback quality', () => {
      cy.getPlayer()
        .then(async ($player) => {
          const canSet = await $player[0].canSetPlaybackQuality();
          const qualities: string[] = $player.prop(PlayerProp.PlaybackQualities);
          if (!canSet || qualities.length === 0) return;
          const newQuality = (qualities[Math.floor(Math.random() * qualities.length)]);
          if (isUndefined(newQuality)) return;
          cy.playbackQuality(newQuality);
          cy.getPlayer()
            .should(() => {
              expect($player.prop(PlayerProp.PlaybackQuality)).to.eq(newQuality);
            })
            .and('not.be.buffering')
            .and('be.playing');
        });
    });

    it('should toggle fullscreen', () => {
      cy.getPlayer()
        .then(async ($player) => {
          const canSet = await $player[0].canSetFullscreen();
          const adapter = await $player[0].getAdapter();
          const methodExists = !isUndefined(adapter.enterFullscreen);
          if (!canSet || !methodExists) return false;
          await $player[0].callAdapter('enterFullscreen');
          return true;
        })
        .then((didSet) => {
          if (!didSet) return;
          cy.play();
          cy.getPlayer().should('be.playing');
          cy.getPlayer().should('be.fullscreen');
          cy.getPlayer().then(($player) => {
            cy.document().its('fullscreenElement').should('eq', $player[0]);
          });
          cy.getPlayer().should('be.playing');
          cy.exitFullscreen();
          cy.getPlayer().should('not.be.fullscreen');
          cy.getPlayer().should('be.playing');
        });
    });

    it('should toggle picture-in-picture', () => {
      cy.getPlayer()
        .then(async ($player) => {
          const canSet = await $player[0].canSetPiP();
          if (!canSet) return;
          cy.play();
          cy.getPlayer().should('be.playing');
          cy.enterPiP();
          cy.getPlayer().should('be.pip');
          cy.document().its('pictureInPictureElement').should('eq', $player[0]);
          cy.getPlayer().should('be.playing');
          cy.exitPiP();
          cy.getPlayer().should('not.be.pip');
          cy.getPlayer().should('be.playing');
        });
    });

    it('should autoplay', () => {
      cy.getPlayer().then($player => { $player.prop(PlayerProp.Autoplay, true) })
      cy.getPlayer().should('be.playing')
      cy.pause();
    });
  });
};
