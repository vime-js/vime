import Vue, { CreateElement } from 'vue';

export function define(tagName: string, clazz: any) {
  const isClient = (typeof window !== 'undefined');
  if (isClient && !customElements.get(tagName)) customElements.define(tagName, clazz);
}

export function method(name: string) {
  return function proxy(this: any, ...args: any[]) {
    return this.$refs.ref[name](...args);
  };
}

export function render(tagName: string, events: string[]) {
  return function proxy(this: Vue, createElement: CreateElement) {
    const self = this;

    const listeners = events.reduce((prevListeners, event) => ({
      ...prevListeners,
      [event]: ($event: CustomEvent<any>) => {
        let emittedValue: any = $event.detail;
        if ($event.detail?.value) emittedValue = $event.detail.value;
        self.$emit(event, emittedValue);
      },
    }), self.$listeners);

    return createElement(tagName, {
      ref: 'ref',
      domProps: { ...self.$props },
      on: listeners,
    }, [self.$slots.default]);
  };
}
