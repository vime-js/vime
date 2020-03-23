import { listen, run_all } from 'svelte/internal';

export default function vFocus(node) {
  const dispose = [];

  const onFocus = (e) => {
    const isFocused = (e.type === 'mouseenter' || e.type === 'focus');
    if (!isFocused) node.blur();
    node.dispatchEvent(new CustomEvent('focuschange', { detail: isFocused }));
  };

  const listenTo = (event) => { dispose.push(listen(node, event, onFocus)); };

  listenTo('focus');
  listenTo('blur');
  listenTo('mouseenter');
  listenTo('mouseleave');

  return {
    destroy() { run_all(dispose); },
  };
}
