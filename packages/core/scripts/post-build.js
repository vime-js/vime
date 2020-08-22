/* eslint-disable no-param-reassign */

const { readFileSync, writeFileSync } = require('fs');
const { formatSideBarLabel, getComponentsDocs } = require('../../../docs/helpers/components');

const writeFrontMatter = (content) => {
  const name = /^#\s([a-z-]+)/.exec(content)[1];
  const label = formatSideBarLabel(name);
  return content.replace(/^#\s[a-z-]+/,
    '---\n'
    + `title: ${name}\n`
    + `sidebar_label: ${label}\n`
    + 'slug: api\n'
    + '---');
};

const rewriteURLs = (content) => content.replace(/\[[a-z-]+\]\(.+\)/g, (match) => {
  if (match === null) return undefined;
  const componentName = /\[(.+)\]/.exec(match)[1];
  const path = /\((.+)\)/.exec(match)[1];
  return `[${componentName}](${path}/readme.md)`;
});

const escapePipeInTables = (content) => content.replace(/\s\\\|\s/g, ' ∣ ');

const putCodeUsageInTabs = (content) => {
  const usageBlockStart = content.indexOf('## Usage');
  if (usageBlockStart === -1) return content;
  const usageBlockEnd = content.slice(usageBlockStart).search(/\n##\s/);
  const usageBlock = content.substr(usageBlockStart, usageBlockEnd).replace(/\s*\S*$/, '');

  content = content.replace(/(---\s+)(?=[A-Z])/,
    '---\n\n'
    + 'import Tabs from \'@theme/Tabs\'\n'
    + 'import TabItem from \'@theme/TabItem\'\n\n');

  const values = [];
  const tabs = [];
  const order = ['html', 'react', 'vue', 'angular'];
  const getValue = (header) => header.replace('### ', '').toLowerCase();

  const langHeaders = usageBlock
    .match(/###\s(.+)/gm)
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

// eslint-disable-next-line no-restricted-syntax
for (const doc of getComponentsDocs()) {
  let content = readFileSync(doc).toString();
  content = writeFrontMatter(content);
  content = rewriteURLs(content);
  content = escapePipeInTables(content);
  content = putCodeUsageInTabs(content);
  writeFileSync(doc, content);
}
