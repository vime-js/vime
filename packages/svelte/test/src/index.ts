import App from './App.svelte';

const app = new App({
  target: document.body,
});

export default app;

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
  // @ts-ignore
  import.meta.hot.dispose(() => { app.$destroy(); });
}
