const { getComponentsDocs, toTitleCase } = require('../../docs/helpers/components');
const { readFileSync, writeFileSync } = require('fs');

const writeFrontMatters = () => {
  for (const doc of getComponentsDocs()) {
    let content = readFileSync(doc).toString();
    const name = /^#\s([a-z-]+)/.exec(content)[1];
    content = content.replace(/^#\s[a-z-]+/,
      '---\n'
      + `title: ${name}\n`
      + `sidebar_label: ${toTitleCase(name.replace('vime', ''))}\n`
      + '---'
    );
    writeFileSync(doc, content);
  }
};

writeFrontMatters();