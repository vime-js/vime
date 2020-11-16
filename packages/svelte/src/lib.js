export const define = (tagName, clazz) => {
  const isClient = (typeof window !== 'undefined');
  if (isClient && !customElements.get(tagName)) customElements.define(tagName, clazz);
};

export const setProp = (el, prop, value) => {
  // eslint-disable-next-line no-param-reassign
  if (el) el[prop] = value;
};
