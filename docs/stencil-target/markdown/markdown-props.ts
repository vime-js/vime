import { JsonDocsProp } from '@stencil/core/internal';

import { MarkdownTable } from './markdown-utils';

const isReadonly = (prop: JsonDocsProp) =>
  prop.docsTags.find((tag: any) => tag.name === 'readonly');
const getProperty = (prop: JsonDocsProp) =>
  `\`${prop.name}\`${prop.required ? ' _(required)_' : ''}${
    isReadonly(prop) ? ' _(readonly)_' : ''
  }`;
const getDesc = (prop: JsonDocsProp) =>
  `${
    prop.deprecation !== undefined
      ? `<span style="color:red">**[DEPRECATED]**</span> ${prop.deprecation}<br/><br/>`
      : ''
  }${prop.docs}`;

export const propsToMarkdown = (props: JsonDocsProp[]) => {
  const content: string[] = [];

  if (props.length === 0) return content;

  content.push('## Properties');
  content.push('');

  const table = new MarkdownTable();

  table.addHeader(['Property', 'Description', 'Type', 'Default']);

  props.forEach(prop => {
    table.addRow([
      getProperty(prop),
      getDesc(prop),
      `\`${prop.type}\``,
      `\`${prop.default}\``,
    ]);
  });

  content.push(...table.toMarkdown());
  content.push('');
  content.push('');

  return content;
};
