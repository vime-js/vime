import { getElement } from '@stencil/core';
import { createStencilHook } from '../../../utils/stencil';
import { MediaPlayer } from './MediaPlayer';

const players = new Set<HTMLVmPlayerElement>();

export function withAutopause(player: MediaPlayer) {
  const el = getElement(player) as HTMLVmPlayerElement;
  createStencilHook(player, () => {
    players.add(el);
  }, () => {
    players.delete(el);
  });
}

export function autopause(player: MediaPlayer) {
  const el = getElement(player) as HTMLVmPlayerElement;
  players.forEach((p) => { if (p !== el && p.autopause) p.paused = true; });
}
