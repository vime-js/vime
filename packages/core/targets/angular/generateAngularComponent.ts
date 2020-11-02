import { ComponentCompilerMeta } from '@stencil/core/internal';
import { dashToPascalCase } from '../../src/utils/string';
import { generateImports, ignoreChecks, jsxEventName } from '../targetHelpers';

export const generateAngularComponent = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const displayName = dashToPascalCase(cmpMeta.tagName);
  const {
    tagName, properties, methods, events,
  } = cmpMeta;

  return `
${ignoreChecks()}
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, initOutputs } from '../lib';
${generateImports(cmpMeta, components, ['JSX', 'Components'], 'WebComponent')}

const ${displayName}Inputs: string[] = [
  ${properties.map((prop) => `'${prop.name}',`).join('\n  ')}
];

const ${displayName}Methods: string[] = [
  ${methods.map((method) => `'${method.name}',`).join('\n  ')}
];

const ${displayName}Outputs: string[] = [
  ${events.filter((event) => !event.internal).map((event) => `'${event.name}',`).join('\n  ')}
];

export type Emitter<T extends ((...args: any[]) => any) | undefined> = EventEmitter<Parameters<Exclude<T, undefined>>[0]>;

export declare interface ${displayName} extends Components.${displayName} {}

@ProxyCmp({
  inputs: ${displayName}Inputs,
  methods: ${displayName}Methods,
})
@Component({
  selector: '${tagName}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ${displayName}Inputs,
  outputs: ${displayName}Outputs,
})
export class ${displayName} {
  protected el: HTMLElement;

  ${events
    .filter((event) => !event.internal)
    .map((event) => `/** ${event.docs.text} */\n  ${event.name}!: Emitter<JSX.${displayName}["${jsxEventName(event.name)}"]>;`)
    .join('\n  ')}

  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    initOutputs(this, [${events.filter((event) => !event.internal).map((event) => `'${event.name}'`).join(', ')}])
  }
}
  `;
};
