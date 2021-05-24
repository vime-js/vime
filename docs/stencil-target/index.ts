import { JsonDocs, JsonDocsComponent } from '@stencil/core/internal';
import fs from 'fs';
import { resolve } from 'path';
import { dashToPascalCase } from '../../src/utils/string';

import { stylesToMarkdown } from './markdown/markdown-css-props';
import { depsToMarkdown } from './markdown/markdown-dependencies';
import { eventsToMarkdown } from './markdown/markdown-events';
import { methodsToMarkdown } from './markdown/markdown-methods';
import { propsToMarkdown } from './markdown/markdown-props';
import { slotsToMarkdown } from './markdown/markdown-slots';
import { usageToMarkdown } from './markdown/markdown-usage';

const OUTPUT_ROOT = resolve(__dirname, '../docs');
const AUTO_GEN_COMMENT = '<!-- Auto Generated Below -->';

const generateMarkdown = (
  component: JsonDocsComponent,
  allComponents: JsonDocsComponent[],
) =>
  [
    '---',
    `title: ${component.tag}`,
    // Slice off {Vm}*
    `sidebar_label: ${dashToPascalCase(component.tag).slice(2)}`,
    '---',
    '',
    component.docs,
    '',
    AUTO_GEN_COMMENT,
    '',
    ...usageToMarkdown(component.usage),
    ...propsToMarkdown(component.props),
    ...methodsToMarkdown(component.methods),
    ...eventsToMarkdown(component.events),
    ...slotsToMarkdown(component.slots),
    ...stylesToMarkdown(component.styles),
    ...(component.dependencies ? depsToMarkdown(component, allComponents) : []),
    '',
  ].join('\n');

const generateComponentDoc = async (
  component: JsonDocsComponent,
  allComponents: JsonDocsComponent[],
) => {
  const outputPathFromRoot = `${
    component.dirPath!.match(/components\/.+/)![0]
  }.md`;
  const outputPath = resolve(OUTPUT_ROOT, outputPathFromRoot);
  const content = generateMarkdown(component, allComponents);

  fs.mkdirSync(outputPath.substr(0, outputPath.lastIndexOf('/')), {
    recursive: true,
  });

  fs.writeFileSync(outputPath, content);
};

export const siteDocsOutputTarget = async (docs: JsonDocs) => {
  if (!fs.existsSync(OUTPUT_ROOT)) {
    fs.mkdirSync(OUTPUT_ROOT);
  }

  await Promise.all(
    docs.components.map(component =>
      generateComponentDoc(component, docs.components),
    ),
  );
};
