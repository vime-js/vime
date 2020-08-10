import 'cypress-plugin-snapshots/commands';
import { PlayerProp } from '../../src/components/core/player/PlayerProp';

Cypress.Commands.add('player', () => cy.get('vime-player', { timeout: 25000 }));

Cypress.Commands.add('play', () => cy.player()
  .then(($player) => {
    $player[0].play();
    return $player;
  }));

Cypress.Commands.add('pause', () => cy.player()
  .then(($player) => {
    $player[0].pause();
    return $player;
  }));

Cypress.Commands.add('volume', (level: number) => cy.player()
  .then(($player) => {
    $player[0].callAdapter('setVolume', level);
    return $player;
  }));

Cypress.Commands.add('mute', (muted: boolean) => cy.player()
  .then(($player) => {
    $player[0].callAdapter('setMuted', muted);
    return $player;
  }));

Cypress.Commands.add('playbackRate', (rate: number) => cy.player()
  .then(async ($player) => {
    const canSet = await $player[0].canSetPlaybackRate();
    const rates: number[] = $player.prop(PlayerProp.PlaybackRates);
    if (!canSet || (rates.length === 0) || !(rates.includes(rate))) return $player;
    $player[0].callAdapter('setPlaybackRate', rate);
    return $player;
  }));

Cypress.Commands.add('playbackQuality', (quality: string) => cy.player()
  .then(async ($player) => {
    const canSet = await $player[0].canSetPlaybackQuality();
    const qualities: string[] = $player.prop(PlayerProp.PlaybackQualities);
    if (!canSet || (qualities.length === 0) || !(qualities.includes(quality))) return $player;
    $player[0].callAdapter('setPlaybackQuality', quality);
    return $player;
  }));

Cypress.Commands.add('raf', () => cy.window()
  .then((window) => new Promise((res) => {
    window.requestAnimationFrame(res);
  })));

Cypress.Commands.add('enterFullscreen', () => cy.player()
  .then(async ($player) => $player[0].enterFullscreen()));

Cypress.Commands.add('exitFullscreen', () => cy.player()
  .then(async ($player) => $player[0].exitFullscreen()));

Cypress.Commands.add('enterPiP', () => cy.player()
  .then(async ($player) => $player[0].enterPiP()));

Cypress.Commands.add('exitPiP', () => cy.player()
  .then(async ($player) => $player[0].exitPiP()));

Cypress.Commands.add('seekTo', (time: number) => cy.player()
  .then(($player) => {
    $player[0].callAdapter('setCurrentTime', time);
    return $player;
  }));

Cypress.Commands.add('control', (label: string) => cy.get(`*[aria-label="${label}"]`));

Cypress.Commands.add('controls', (
  position: 'top' | 'center' | 'bottom' = 'bottom',
) => cy.get(`vime-controls[pin*="${position}"]`));

Cypress.Commands.add('tooltip', { prevSubject: true }, ($subject) => cy
  .get(`#${$subject.attr('aria-describedby')}`));

Cypress.Commands.add('menu', { prevSubject: true }, ($subject) => cy
  .get(`#${$subject.attr('aria-controls')}`));
