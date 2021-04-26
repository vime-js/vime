import { ComponentCompilerMeta } from '@stencil/core/internal';

import { dashToPascalCase } from '../../../src/utils/string';
import {
  defineAllDependencies,
  fileName,
  ignoreChecks,
  importAllDepdencies,
  jsxEventName,
} from '../../../src/utils/target';

export const generateAngularComponent = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
): string => {
  const name = fileName(cmpMeta);
  const displayName = dashToPascalCase(cmpMeta.tagName);
  const { tagName, properties, methods, events } = cmpMeta;

  return `
${ignoreChecks()}
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, initOutputs } from '../lib';
import type { JSX, Components } from '@vime/core/dist/types';
${importAllDepdencies(cmpMeta, components)}

const ${name}Inputs: string[] = [
  ${properties.map(prop => `'${prop.name}',`).join('\n  ')}
];

const ${name}Methods: string[] = [
  ${methods.map(method => `'${method.name}',`).join('\n  ')}
];

const ${name}Outputs: string[] = [
  ${events
    .filter(event => !event.internal)
    .map(event => `'${event.name}',`)
    .join('\n  ')}
];

export type Emitter<T extends ((...args: any[]) => any) | undefined> = EventEmitter<Parameters<Exclude<T, undefined>>[0]>;

export declare interface ${name} extends Components.${displayName} {}

@ProxyCmp({
  inputs: ${name}Inputs,
  methods: ${name}Methods,
})
@Component({
  selector: '${tagName}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ${name}Inputs,
  outputs: ${name}Outputs,
})
export class ${name} {
  protected el: HTMLElement;

  ${events
    .filter(event => !event.internal)
    .map(
      event =>
        `/** ${event.docs.text} */\n  ${
          event.name
        }!: Emitter<JSX.${displayName}["${jsxEventName(event.name)}"]>;`,
    )
    .join('\n  ')}

  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    ${defineAllDependencies(cmpMeta, components)
      .trim()
      .split('\n')
      .join('\n    ')}
    c.detach();
    this.el = r.nativeElement;
    initOutputs(this, [${events
      .filter(event => !event.internal)
      .map(event => `'${event.name}'`)
      .join(', ')}])
  }
}
  `;
};
