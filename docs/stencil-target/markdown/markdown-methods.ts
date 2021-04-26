import { JsonDocsMethod } from '@stencil/core/internal';

import { MarkdownTable } from './markdown-utils';

const getName = (method: JsonDocsMethod) => `\`${method.name}\``;
const getDesc = (method: JsonDocsMethod) =>
  `${
    method.deprecation !== undefined
      ? `<span style="color:red">**[DEPRECATED]**</span> ${method.deprecation}<br/><br/>`
      : ''
  }${method.docs}`;
const getSignature = (method: JsonDocsMethod) => `\`${method.signature}\``;

export const methodsToMarkdown = (methods: JsonDocsMethod[]) => {
  const content: string[] = [];

  if (methods.length === 0) return content;

  content.push('## Methods');
  content.push('');

  const table = new MarkdownTable();

  table.addHeader(['Method', 'Description', 'Signature']);

  methods.forEach(method => {
    table.addRow([getName(method), getDesc(method), getSignature(method)]);
  });

  content.push(...table.toMarkdown());
  content.push('');
  content.push('');

  return content;
};
