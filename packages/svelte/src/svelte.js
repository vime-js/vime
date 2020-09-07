/* eslint-disable no-undef, import/no-unresolved */
import { defineCustomElements } from '@vime/core/loader';
import { usePlayer, usePlayerStore } from '@vime/core';

export * from './svelte/index';
export * from '@vime/core';

export {
  usePlayer,
  usePlayerStore,
};

defineCustomElements();
