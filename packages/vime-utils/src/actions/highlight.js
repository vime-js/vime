import { listen } from 'svelte/internal';

export default function vHighlight(node, duration = 100) {
  const off = listen(node, 'touchstart', () => {
    node.dispatchEvent(new CustomEvent('highlightchange', { detail: true }));

    setTimeout(() => {
      node.dispatchEvent(new CustomEvent('highlightchange', { detail: false }));
    }, duration);
  });

  return {
    destroy() { off(); },
  };
}
