export * from '@vime/core';
export * from './components';
export * from './usePlayerStore';

if (typeof window !== 'undefined') {
  const script = document.createElement('script');
  script.type = 'module';
  script.defer = true;
  script.src = 'https://cdn.jsdelivr.net/npm/@vime/core@latest/dist/vime/vime.esm.js';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode!.insertBefore(script, firstScriptTag);
}
