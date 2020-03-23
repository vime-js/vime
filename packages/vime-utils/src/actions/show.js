/* eslint-disable no-param-reassign */

export default function vShow(node, initialVisibility) {
  const update = (isShowing) => {
    node.style.opacity = isShowing ? '1' : '0';
    node.style.visibility = isShowing ? 'visible' : 'hidden';
  };

  update(initialVisibility);

  const prevTransition = window.getComputedStyle(node).transition;
  node.style.transition = `${prevTransition ? `${prevTransition}, ` : ''}opacity 0.4s ease-in-out`;

  return {
    update,
    destroy: () => {
      update(initialVisibility);
      node.style.transition = prevTransition;
    },
  };
}
