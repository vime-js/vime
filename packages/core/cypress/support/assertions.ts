/* eslint-disable no-undef, no-underscore-dangle, func-names */

import { PlayerProp } from '../../src/components/core/player/PlayerProp';
import { PlayerEvent } from '../../src/components/core/player/PlayerEvent';

const isPlayer = ($player: any) => {
  if ($player) chai.expect($player).to.have.prop('nodeName', 'VIME-PLAYER');
};

chai.Assertion.addMethod('readyForPlayback', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  this.assert(
    $player && $player.prop(PlayerProp.playbackReady),
    'expected #{this} to be ready for playback',
    'expected #{this} to not be ready for playback',
    $player,
  );
});

chai.Assertion.addMethod('playing', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  const isPlaying = !$player.prop(PlayerProp.paused) && $player.prop(PlayerProp.playing);
  this.assert(
    isPlaying,
    'expected #{this} to be `playing`',
    'expected #{this} to not be `playing`',
    $player,
  );
});

chai.Assertion.addMethod('buffering', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  this.assert(
    $player.prop(PlayerProp.buffering),
    'expected #{this} to be `buffering`',
    'expected #{this} to not be `buffering`',
    $player,
  );
});

chai.Assertion.addMethod('pip', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  this.assert(
    $player.prop(PlayerProp.isPiPActive),
    'expected #{this} to be in `picture-in-picture`',
    'expected #{this} to not be in `picture-in-picture`',
    $player,
  );
});

chai.Assertion.addMethod('fullscreen', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  this.assert(
    $player.prop(PlayerProp.isFullscreenActive),
    'expected #{this} to be in `fullscreen`',
    'expected #{this} to not be in `fullscreen`',
    $player,
  );
});

chai.Assertion.addMethod('seekedForwards', function (seeked: { from: number, to: number }) {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;

  isPlayer($player);

  const hasSeeked = !$player.prop(PlayerProp.seeking)
    && ($player.prop(PlayerProp.currentTime) > seeked.from)
    && ($player.prop(PlayerProp.currentTime) >= seeked.to);

  this.assert(
    hasSeeked,
    `expected #{this} to have seeked forwards from \`${seeked.from}\` to \`${seeked.to}\``,
    `expected #{this} to not have seeked forwards from \`${seeked.from}\` to \`${seeked.to}\``,
    $player,
  );
});

chai.Assertion.addMethod('seekedBackwards', function (seeked: { from: number, to: number }) {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;

  isPlayer($player);

  const hasSeeked = !$player.prop(PlayerProp.seeking)
    && ($player.prop(PlayerProp.currentTime) < seeked.from)
    && ($player.prop(PlayerProp.currentTime) >= seeked.to);

  this.assert(
    hasSeeked,
    `expected #{this} to have seeked backwards from \`${seeked.from}\` to \`${seeked.to}\``,
    `expected #{this} to not have seeked backwards from \`${seeked.from}\` to \`${seeked.to}\``,
    $player,
  );
});

chai.Assertion.addMethod('firedPlayingChange', function (
  events: Record<any, ReturnType<typeof cy.spy>>,
) {
  const hasFired = events[PlayerEvent.playingChange].callCount > 0;
  this.assert(
    hasFired,
    `expected #{this} to have fired \`${PlayerEvent.playingChange}\` event`,
    `expected #{this} to not have fired \`${PlayerEvent.playingChange}\` event`,
    events,
  );
});

chai.Assertion.addMethod('firedSeekingChange', (
  events: Record<any, ReturnType<typeof cy.spy>>,
) => {
  chai.expect(events[PlayerEvent.seekingChange])
    .to.have.been.calledWith(true)
    .and.to.have.been.calledWith(false);
  chai.expect(events[PlayerEvent.seeked]).to.have.been.called;
  chai.expect(events[PlayerEvent.seekingChange]).to.be.calledBefore(events[PlayerEvent.seeked]);
});
