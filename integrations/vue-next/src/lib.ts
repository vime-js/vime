import { ComponentPublicInstance, h } from 'vue';

export function define(tagName: string, clazz: any) {
  const isClient = (typeof window !== 'undefined');
  if (isClient && !customElements.get(tagName)) customElements.define(tagName, clazz);
}

export function method(name: string) {
  return function proxy(this: any, ...args: any[]) {
    return this.$refs.ref[name](...args);
  };
}

function listen(node: HTMLElement, event: string, handler: (...args: any[]) => void) {
  node.addEventListener(event, handler);
  return () => { node.removeEventListener(event, handler); };
}

export function render(tagName: string, events: string[]) {
  return function proxy(this: ComponentPublicInstance) {
    let dispose: (() => void)[] = [];

    const forwardEvent = (event: string) => ($event: CustomEvent<any>) => {
      const { detail } = $event;
      this.$emit(event, detail);
    };

    return h(tagName, {
      ref: 'ref',
      ...this.$props,
      onVnodeMounted(vnode) {
        events.forEach((event) => {
          dispose.push(listen(vnode.el! as HTMLElement, event, forwardEvent(event)));
        });
      },
      onVnodeBeforeUnmount() {
        dispose.forEach((fn) => fn());
        dispose = [];
      },
    }, this.$slots.default?.());
  };
}
