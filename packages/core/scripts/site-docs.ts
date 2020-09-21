/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { resolve } from 'path';
import fs from 'fs';
import { JsonDocs, JsonDocsComponent } from '@stencil/core/internal';
import { isUndefined } from '../src/utils/unit';
// @ts-ignore
import { formatSidebarLabel } from '../../../docs/helpers/components-sidebar';

const prettier = require('prettier');

const writeFrontMatter = (content: string) => {
  const name = /^#\s([a-z-]+)/.exec(content)![1];
  const label = formatSidebarLabel(name);
  return content.replace(/^#\s[a-z-]+/,
    '---\n'
    + `title: ${name}\n`
    + `sidebar_label: ${label}\n`
    + '---');
};

const rewriteURLs = (content: string) => content.replace(/\[[a-z-`]+\]\(.+\)/gm, (match) => {
  if (match === null) return '';
  const componentName = /\[(.+)\]/.exec(match)![1]!;
  const path = /\((.+)\)/.exec(match)![1]!;
  return `[${componentName}](${path.replace('../', '').replace('/readme.md', '')}.md)`;
});

const escapePipeInTables = (content: string) => content.replace(/\s\\\|\s/g, ' ∣ ');

const putCodeUsageInTabs = (content: string) => {
  const usageBlockStart = content.indexOf('## Usage');
  if (usageBlockStart === -1) return content;
  const usageBlockEnd = content.slice(usageBlockStart).search(/\n##\s/)!;
  const usageBlock = content.substr(usageBlockStart, usageBlockEnd).replace(/\s*\S*$/, '');

  content = content.replace(/(---\s+)(?=[A-Z])/,
    '---\n\n'
    + 'import Tabs from \'@theme/Tabs\'\n'
    + 'import TabItem from \'@theme/TabItem\'\n\n');

  const values: string[] = [];
  const tabs: string[] = [];
  const order: string[] = ['html', 'react', 'vue', 'svelte', 'stencil', 'angular'];
  const getValue = (header: string) => header.replace('### ', '').toLowerCase();

  const langHeaders = usageBlock
    .match(/###\s(.+)/gm)!
    .sort((a, b) => order.indexOf(getValue(a)) - order.indexOf(getValue(b)));

  langHeaders.forEach((langHeader) => {
    const label = langHeader.replace('### ', '');
    const value = getValue(langHeader);
    values.push(`{ label: '${value === 'html' ? label.toUpperCase() : label}', value: '${value}' }`);

    const codeBlockStart = usageBlock.indexOf(langHeader);
    const codeBlockEnd = usageBlock.slice(codeBlockStart).search(/\n\n#/);
    const codeBlock = usageBlock
      .substr(codeBlockStart, (codeBlockEnd === -1 ? undefined : codeBlockEnd))
      .replace(`${langHeader}\n\n`, '');

    tabs.push(`
<TabItem value="${value}">

${codeBlock}

</TabItem>
    `);
  });

  return content.replace(usageBlock, `
## Usage

<Tabs
  groupId="framework"
  defaultValue="html"
  values={[
    ${values.join(',\n\t')}
  ]}>
${tabs.join('\n')}
</Tabs>
  `);
};

const outputRoot = resolve(__dirname, '../../../docs/docs');

const generateComponentDoc = async (component: JsonDocsComponent) => {
  const hasReadme = !isUndefined(component.readmePath);
  let content = hasReadme ? fs.readFileSync(component.readmePath!).toString() : '';
  content = rewriteURLs(content);
  content = writeFrontMatter(content);
  content = escapePipeInTables(content);
  content = putCodeUsageInTabs(content);
  content = prettier.format(content, {
    parser: 'markdown',
    printWidth: 80,
    tabWidth: 2,
    singleQuote: true,
    logLevel: 'silent',
  });
  const outputPathFromRoot = `${component.dirPath!.match(/components\/.+/)![0]}.md`;
  const outputPath = resolve(outputRoot, outputPathFromRoot);
  const isUpdate = fs.existsSync(outputPath);
  if (!isUpdate) {
    fs.mkdirSync(outputPath.substr(0, outputPath.lastIndexOf('/')), { recursive: true });
    fs.writeFileSync(outputPath, content);
    console.log(`created site docs: ${outputPathFromRoot}`);
  } else {
    const prevContent = fs.readFileSync(outputPath).toString();
    if (prevContent !== content) {
      fs.writeFileSync(outputPath, content);
      console.log(`updated site docs: ${outputPathFromRoot}`);
    }
  }
};

export const generateSiteDocs = async (docs: JsonDocs) => {
  if (!fs.existsSync(outputRoot)) { fs.mkdirSync(outputRoot); }
  await Promise.all(docs.components.map(generateComponentDoc));
};
