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

// eslint-disable-next-line no-restricted-syntax
for (const doc of getComponentsDocs()) {
  let content = readFileSync(doc).toString();
  content = writeFrontMatter(content);
  content = rewriteURLs(content);
  content = escapePipeInTables(content);
  writeFileSync(doc, content);
}
