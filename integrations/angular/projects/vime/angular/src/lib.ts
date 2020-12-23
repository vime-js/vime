/* eslint-disable */

import { EventEmitter } from '@angular/core';

export const define = (tagName: string, clazz: any) => {
  const isClient = (typeof window !== 'undefined');
  if (isClient && !customElements.get(tagName)) customElements.define(tagName, clazz);
};

export const proxyInputs = (Component: any, inputs: string[]) => {
  const Prototype = Component.prototype;
  inputs.forEach((input) => {
    Object.defineProperty(Prototype, input, {
      get() {
        return this.el[input];
      },
      set(val: any) {
        this.z.runOutsideAngular(() => (this.el[input] = val));
      },
    });
  });
};

export const proxyMethods = (Component: any, methods: string[]) => {
  const Prototype = Component.prototype;
  methods.forEach((methodName) => {
    Prototype[methodName] = function () {
      const args = arguments;
      return this.z.runOutsideAngular(() => this.el[methodName].apply(this.el, args));
    };
  });
};

export const initOutputs = (instance: any, events: string[]) => {
  events.forEach((eventName) => (instance[eventName] = new EventEmitter()));
}

export function ProxyCmp(opts: { inputs?: any; methods?: any }) {
  return function (Component: any) {
    if (opts.inputs) proxyInputs(Component, opts.inputs);
    if (opts.methods) proxyMethods(Component, opts.methods);
    return Component;
  };
}
