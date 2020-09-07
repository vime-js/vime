/* eslint-disable no-undef, import/no-unresolved, import/extensions */
import { defineCustomElements } from '@vime/core/loader';
import { usePlayer, usePlayerStore } from '../dist/esm/index';

export * from './svelte/index';
export * from '@vime/core';

export {
  usePlayer,
  usePlayerStore,
};

defineCustomElements();
