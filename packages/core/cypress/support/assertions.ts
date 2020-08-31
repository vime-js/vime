/* eslint-disable no-undef, no-underscore-dangle, func-names */

const isPlayer = ($player: any) => {
  if ($player) chai.expect($player).to.have.prop('nodeName', 'VIME-PLAYER');
};

chai.Assertion.addMethod('readyForPlayback', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  this.assert(
    $player && $player.prop('playbackReady'),
    'expected #{this} to be ready for playback',
    'expected #{this} to not be ready for playback',
    $player,
  );
});

chai.Assertion.addMethod('playing', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  const isPlaying = !$player.prop('paused') && $player.prop('playing');
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
    $player.prop('buffering'),
    'expected #{this} to be `buffering`',
    'expected #{this} to not be `buffering`',
    $player,
  );
});

chai.Assertion.addMethod('pip', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  this.assert(
    $player.prop('isPiPActive'),
    'expected #{this} to be in `picture-in-picture`',
    'expected #{this} to not be in `picture-in-picture`',
    $player,
  );
});

chai.Assertion.addMethod('fullscreen', function () {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;
  isPlayer($player);
  this.assert(
    $player.prop('isFullscreenActive'),
    'expected #{this} to be in `fullscreen`',
    'expected #{this} to not be in `fullscreen`',
    $player,
  );
});

chai.Assertion.addMethod('seekedForwards', function (seeked: { from: number, to: number }) {
  const $player: JQuery<HTMLVimePlayerElement> = this._obj;

  isPlayer($player);

  const hasSeeked = !$player.prop('seeking')
    && ($player.prop('currentTime') > seeked.from)
    && ($player.prop('currentTime') >= seeked.to);

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

  const hasSeeked = !$player.prop('seeking')
    && ($player.prop('currentTime') < seeked.from)
    && ($player.prop('currentTime') >= seeked.to);

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
  const hasFired = events.vPlayingChange.callCount > 0;
  this.assert(
    hasFired,
    `expected #{this} to have fired \`${'playingChange'}\` event`,
    `expected #{this} to not have fired \`${'playingChange'}\` event`,
    events,
  );
});

chai.Assertion.addMethod('firedSeekingChange', (
  events: Record<any, ReturnType<typeof cy.spy>>,
) => {
  chai.expect(events.vSeekingChange)
    .to.have.been.calledWith(true)
    .and.to.have.been.calledWith(false);
  chai.expect(events.vSeeked).to.have.been.called;
  chai.expect(events.vSeekingChange).to.be.calledBefore(events.vSeeked);
});
