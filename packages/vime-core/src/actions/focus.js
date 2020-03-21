import { listen, run_all } from 'svelte/internal';

export default function focus(node) {
  const dispose = [];

  const onFocus = (e) => {
    const isFocused = (e.type === 'mouseenter' || e.type === 'focus');
    if (!isFocused) node.blur();
    node.dispatchEvent(new CustomEvent('focuschange', { detail: isFocused }));
  };

  dispose.push(listen(node, 'focus', onFocus));
  dispose.push(listen(node, 'blur', onFocus));
  dispose.push(listen(node, 'mouseenter', onFocus));
  dispose.push(listen(node, 'mouseleave', onFocus));

  return {
    destroy() { run_all(dispose); },
  };
}
