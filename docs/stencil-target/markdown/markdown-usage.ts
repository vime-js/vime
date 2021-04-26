import { JsonDocsUsage } from '@stencil/core/internal';

import { dashToPascalCase } from '../../../src/utils/string';

const languagesOrder = [
  'html',
  'react',
  'vue',
  'vue 2',
  'vue 3',
  'svelte',
  'stencil',
  'angular',
];

const formatLanguageLabel = (lang: string) =>
  lang === 'html' ? lang.toUpperCase() : dashToPascalCase(lang);

export const usageToMarkdown = (usage: JsonDocsUsage) => {
  const content: string[] = [];

  const languages = Object.keys(usage).sort(
    (a, b) => languagesOrder.indexOf(a) - languagesOrder.indexOf(b),
  );

  if (languages.length === 0) return content;

  content.push('## Usage');
  content.push('');
  content.push("import Tabs from '@theme/Tabs'");
  content.push("import TabItem from '@theme/TabItem'");

  content.push(`
<Tabs
groupId="framework"
defaultValue="html"
values={[
  ${languages
    .map(lang => `{ label: '${formatLanguageLabel(lang)}', value: '${lang}' }`)
    .join(',\n  ')}
]}>`);

  languages.forEach(lang => {
    content.push(`
<TabItem value="${lang}">

${usage[lang]}

</TabItem>`);
  });

  content.push('</Tabs>');
  content.push('');
  content.push('');

  return content;
};
