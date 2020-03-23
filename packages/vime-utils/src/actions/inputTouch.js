import { run_all, listen } from 'svelte/internal';
import { listen_for_touch_input } from '../support';
import { set_style } from '../style';

// @see https://github.com/sampotts/rangetouch
export default function vInputTouch(node) {
  const calcValue = (e) => {
    const input = e.target;
    const touch = e.changedTouches[0];
    const min = parseFloat(input.getAttribute('min')) || 0;
    const max = parseFloat(input.getAttribute('max')) || 100;
    const step = parseFloat(input.getAttribute('step')) || 1;
    const delta = max - min;

    // Calculate percentage.
    let percent;
    const clientRect = input.getBoundingClientRect();

    // NOTE: hardcoded thumbwidth.
    const thumbWidth = ((100 / clientRect.width) * (13 / 2)) / 100;

    // Determine left percentage.
    percent = (100 / clientRect.width) * (touch.clientX - clientRect.left);

    // Don't allow outside bounds.
    percent = Math.max(0, Math.min(percent, 100));

    // Factor in the thumb offset.
    if (percent < 50) {
      percent -= (100 - percent * 2) * thumbWidth;
    } else if (percent > 50) {
      percent += (percent - 50) * 2 * thumbWidth;
    }

    const position = delta * (percent / 100);

    if (step >= 1) {
      return min + Math.round(position / step) * step;
    }
    // NOTE: this part differs from original implementation to save space.
    // Only supports 2 decimal places (0.01) as the step.
    return min + parseFloat(position.toFixed(2));
  };

  const onTouch = (e) => {
    if (e.target.disabled) return;
    e.preventDefault();
    e.target.value = calcValue(e);
    // Trigger event.
    const event = new Event(e.type === 'touchend' ? 'change' : 'input', { bubbles: true });
    e.target.dispatchEvent(event);
  };

  let dispose = [];
  let mounted = false;
  let destroyed = true;

  const onMount = () => {
    set_style(node, 'userSelect', 'none');
    set_style(node, 'webKitUserSelect', 'none');
    set_style(node, 'touchAction', 'manipulation');
    const touchEvents = ['touchstart', 'touchmove', 'touchend'];
    touchEvents.forEach((event) => dispose.push(listen(node, event, onTouch)));
  };

  const onDestroy = () => {
    run_all(dispose);
    dispose = [];
    set_style(node, 'userSelect');
    set_style(node, 'webKitUserSelect');
    set_style(node, 'touchAction');
  };

  const onTouchDetect = (isTouch) => {
    if (isTouch && !mounted) {
      onMount();
      mounted = true;
      destroyed = false;
    } else if (!isTouch && !destroyed) {
      onDestroy();
      mounted = false;
      destroyed = true;
    }
  };

  const touchListener = listen_for_touch_input(onTouchDetect);

  return {
    destroy() {
      if (!destroyed) onDestroy();
      if (touchListener) touchListener();
    },
  };
}
