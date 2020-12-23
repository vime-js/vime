import fs from 'fs';
import { resolve } from 'path';
import { JsonDocs, JsonDocsComponent } from '@stencil/core/internal';
import { propsToMarkdown } from './markdown/markdown-props';
import { methodsToMarkdown } from './markdown/markdown-methods';
import { eventsToMarkdown } from './markdown/markdown-events';
import { slotsToMarkdown } from './markdown/markdown-slots';
import { stylesToMarkdown } from './markdown/markdown-css-props';
import { usageToMarkdown } from './markdown/markdown-usage';
import { depsToMarkdown } from './markdown/markdown-dependencies';

const OUTPUT_ROOT = resolve(__dirname, '../../../docs/docs');
const AUTO_GEN_COMMENT = '<!-- Auto Generated Below -->';

const getDefaultReadme = (component: JsonDocsComponent) => [
  `# ${component.tag}`, '', '', '',
].join('\n');

const generateMarkdown = (
  userContent: string,
  component: JsonDocsComponent,
  allComponents: JsonDocsComponent[],
) => [
  userContent,
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
  const outputPathFromRoot = `${component.dirPath!.match(/components\/.+/)![0]}.md`;
  const outputPath = resolve(OUTPUT_ROOT, outputPathFromRoot);
  const isUpdate = fs.existsSync(outputPath);
  const originalFileContent = isUpdate
    ? fs.readFileSync(outputPath).toString()
    : getDefaultReadme(component);
  const userContent = originalFileContent.substr(0, originalFileContent.indexOf(`\n${AUTO_GEN_COMMENT}`));
  const newContent = generateMarkdown(userContent, component, allComponents);
  const hasContentChanged = !isUpdate || (originalFileContent !== newContent);

  if (!hasContentChanged) return;

  if (!isUpdate) {
    fs.mkdirSync(outputPath.substr(0, outputPath.lastIndexOf('/')), { recursive: true });
    fs.writeFileSync(outputPath, newContent);
    console.log(`created doc: ${outputPathFromRoot}`);
  } else {
    fs.writeFileSync(outputPath, newContent);
    console.log(`updated doc: ${outputPathFromRoot}`);
  }
};

export const siteDocsOutputTarget = async (docs: JsonDocs) => {
  if (!fs.existsSync(OUTPUT_ROOT)) { fs.mkdirSync(OUTPUT_ROOT); }
  const { components } = docs;
  await Promise.all(components.map((component) => generateComponentDoc(component, components)));
};
