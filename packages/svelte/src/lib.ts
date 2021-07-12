export const define = (tagName: string, clazz: any) => {
  const isClient = typeof window !== 'undefined';
  if (isClient && !customElements.get(tagName))
    customElements.define(tagName, clazz);
};

export const setProp = (el: HTMLElement, prop: string, value: any) => {
  if (el) (el as any)[prop] = value;
};
