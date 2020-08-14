import { defineCustomElements } from '@vime/core/loader';

export * from './components';

if (typeof window !== 'undefined') {
  defineCustomElements(window);
}