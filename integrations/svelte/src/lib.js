export const define = (tagName, clazz) => {
  const isClient = typeof window !== 'undefined';
  if (isClient && !customElements.get(tagName))
    customElements.define(tagName, clazz);
};

export const setProp = (el, prop, value) => {
  if (el) el[prop] = value;
};
