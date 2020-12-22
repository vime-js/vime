import { JsonDocsComponent } from '@stencil/core/internal';
import { relative } from 'path';

const getCmpLink = (from: JsonDocsComponent, to: string, allComponents: JsonDocsComponent[]) => {
  const destCmp = allComponents.find((c) => c.tag === to);

  if (destCmp) {
    const cmpRelPath = relative(from.dirPath!, destCmp.dirPath!).replace('../', './');
    return `[${to}](${cmpRelPath})`;
  }

  return to;
};

export const depsToMarkdown = (
  component: JsonDocsComponent,
  allComponents: JsonDocsComponent[],
) => {
  const content: string[] = [];
  const deps = Object.entries(component.dependencyGraph);

  if (deps.length === 0) return content;

  content.push('## Dependencies');
  content.push('');

  if (component.dependents.length > 0) {
    const usedBy = component.dependents
      .map((tag) => ` - ${getCmpLink(component, tag, allComponents)}`);

    content.push('### Used by');
    content.push('');
    content.push(...usedBy);
    content.push('');
  }

  if (component.dependencies.length > 0) {
    const dependsOn = component.dependencies
      .map((tag) => `- ${getCmpLink(component, tag, allComponents)}`);

    content.push('### Depends on');
    content.push('');
    content.push(...dependsOn);
    content.push('');
  }

  content.push('');

  return content;
};
