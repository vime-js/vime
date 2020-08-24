import { defineCustomElements } from '@vime/core/loader';

export * from './components';
export * from '@vime/core';

if (typeof window !== 'undefined') {
  defineCustomElements(window);
}
