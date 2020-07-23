/// <reference path="../../src/components.d.ts" />

declare namespace Cypress {
  interface Chainable<Subject> {
    toMatchSnapshot(options?: Partial<{
      ignoreExtralFields: boolean,
      ignoreExtraArrayItems: boolean,
      normalizeJson: boolean,
      replace: any,
      name: string
    }>): Chainable<null>;

    toMatchImageSnapshot(options?: Partial<{
      createDiffImage: boolean,
      threshold: number,
      thresholdType: 'percent' | 'pixels',
      name: string
    }> & Partial<ScreenshotDefaultsOptions>): Chainable<null>;
    
    /**
     * Requests an animation frame and waits for its completion.
     */
    raf(): Chainable<void>

    /**
     * Finds and returns the `vime-player` element.
     */
    player(): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and begins/resumes playback.
     */
    play(): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and pauses playback.
     */
    pause(): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and changes the volume to the given level.
     */
    volume(level: number): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and changes the muted state.
     */
    mute(muted: boolean): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and changes the playback rate.
     */
    playbackRate(rate: number): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and changes the playback quality.
     */
    playbackQuality(quality?: string): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and enters fullscreen.
     */
    enterFullscreen(): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and exits fullscreen.
     */
    exitFullscreen(): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and enters picture-in-picture mode.
     */
    enterPiP(): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and exits picture-in-picture mode.
     */
    exitPiP(): Chainable<JQuery<HTMLVimePlayerElement>>

    /**
     * Finds the `vime-player` element and seeks to the given time.
     */
    seekTo(time: number): Chainable<JQuery<HTMLVimePlayerElement>>
  }

  interface Chainer<Subject> {
    (chainer: 'be.readyForPlayback'): Chainable<Subject>
    (chainer: 'be.playing'): Chainable<Subject>
    (chainer: 'be.buffering'): Chainable<Subject>
    (chainer: 'not.be.buffering'): Chainable<Subject>
    (chainer: 'be.fullscreen'): Chainable<Subject>
    (chainer: 'not.be.fullscreen'): Chainable<Subject>
    (chainer: 'be.pip'): Chainable<Subject>
    (chainer: 'not.be.pip'): Chainable<Subject>
    (chainer: 'not.be.playing'): Chainable<Subject>
    (chainer: 'have.seekedForwards'): (seeked: { from: number, to: number }) => Chainable<Subject>
    (chainer: 'have.seekedBackwards'): (seeked: { from: number, to: number }) => Chainable<Subject>
    (chainer: 'have.firedPlayingChange'): (
      events: Record<any, ReturnType<typeof cy.spy>>
    ) => Chainable<Subject>
    (chainer: 'not.have.firedPlayingChange'): (
      events: Record<any, ReturnType<typeof cy.spy>>
    ) => Chainable<Subject>
    (chainer: 'have.firedSeekingChange'): (
      events: Record<any, ReturnType<typeof cy.spy>>
    ) => Chainable<Subject>
    (chainer: 'not.have.firedSeekingChange'): (
      events: Record<any, ReturnType<typeof cy.spy>>
    ) => Chainable<Subject>
  }
}
