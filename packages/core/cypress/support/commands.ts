import 'cypress-plugin-snapshots/commands';
import { PlayerProp } from '../../src/components/core/player/PlayerProp';

Cypress.Commands.add('getPlayer', () => cy.get('vime-player', { timeout: 15000 }));

Cypress.Commands.add('play', () => cy.getPlayer()
  .then(($player) => {
    $player[0].play();
    return $player;
  }));

Cypress.Commands.add('pause', () => cy.getPlayer()
  .then(($player) => {
    $player[0].pause();
    return $player;
  }));

Cypress.Commands.add('volume', (level: number) => cy.getPlayer()
  .then(($player) => {
    $player[0].callAdapter('setVolume', level);
    return $player;
  }));

Cypress.Commands.add('mute', (muted: boolean) => cy.getPlayer()
  .then(($player) => {
    $player[0].callAdapter('setMuted', muted);
    return $player;
  }));

Cypress.Commands.add('playbackRate', (rate: number) => cy.getPlayer()
  .then(async ($player) => {
    const canSet = await $player[0].canSetPlaybackRate();
    const rates: number[] = $player.prop(PlayerProp.PlaybackRates);
    if (!canSet || (rates.length === 0) || !(rates.includes(rate))) return $player;
    $player[0].callAdapter('setPlaybackRate', rate);
    return $player;
  }));

Cypress.Commands.add('playbackQuality', (quality: string) => cy.getPlayer()
  .then(async ($player) => {
    const canSet = await $player[0].canSetPlaybackQuality();
    const qualities: string[] = $player.prop(PlayerProp.PlaybackQualities);
    if (!canSet || (qualities.length === 0) || !(qualities.includes(quality))) return $player;
    $player[0].callAdapter('setPlaybackQuality', quality);
    return $player;
  }));

Cypress.Commands.add('enterFullscreen', () => cy.getPlayer()
  .then(async ($player) => $player[0].enterFullscreen()));

Cypress.Commands.add('exitFullscreen', () => cy.getPlayer()
  .then(async ($player) => $player[0].exitFullscreen()));

Cypress.Commands.add('enterPiP', () => cy.getPlayer()
  .then(async ($player) => $player[0].enterPiP()));

Cypress.Commands.add('exitPiP', () => cy.getPlayer()
  .then(async ($player) => $player[0].exitPiP()));

Cypress.Commands.add('seekTo', (time: number) => cy.getPlayer()
  .then(($player) => {
    $player[0].callAdapter('setCurrentTime', time);
    return $player;
  }));
