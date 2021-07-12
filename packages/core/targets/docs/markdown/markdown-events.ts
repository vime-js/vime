import { JsonDocsEvent } from '@stencil/core/internal';

import { MarkdownTable } from './markdown-utils';

const getDesc = (event: JsonDocsEvent) =>
  `${
    event.deprecation !== undefined
      ? `<span style="color:red">**[DEPRECATED]**</span> ${event.deprecation}<br/><br/>`
      : ''
  }${event.docs}`;

export const eventsToMarkdown = (events: JsonDocsEvent[]) => {
  const content: string[] = [];

  if (events.length === 0) return content;

  content.push('## Events');
  content.push('');

  const table = new MarkdownTable();

  table.addHeader(['Event', 'Description', 'Type']);

  events.forEach(ev => {
    table.addRow([
      `\`${ev.event}\``,
      getDesc(ev),
      `\`CustomEvent<${ev.detail}>\``,
    ]);
  });

  content.push(...table.toMarkdown());
  content.push('');
  content.push('');

  return content;
};
