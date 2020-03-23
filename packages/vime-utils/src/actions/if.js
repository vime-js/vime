export default function vIf(node, initialVisibility) {
  const update = (shouldDisplay) => {
    // eslint-disable-next-line no-param-reassign
    node.style.display = shouldDisplay ? null : 'none';
  };

  update(initialVisibility);

  return {
    update,
    destroy: () => { update(true); },
  };
}
