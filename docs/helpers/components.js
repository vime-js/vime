const { readdirSync } = require('fs');
const { resolve } = require('path');

// Thanks to copy-pasta from https://stackoverflow.com/a/45130990.
function* getComponentsDocs(dir = resolve(__dirname, '../docs/components')) {
  const entries = readdirSync(dir, { withFileTypes: true });

  // eslint-disable-next-line no-restricted-syntax
  for (const entry of entries) {
    const path = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      yield* getComponentsDocs(path);
    } else {
      yield path;
    }
  }
}

const formatSideBarLabel = (name) => name
  .toLowerCase()
  .replace('vime-', '')
  .replace(/(?:^|-)\w/g, (match) => match.toUpperCase())
  .replace(/-/g, '')
  .replace('Ui', 'UI');

const extractComponentDocCategory = (doc) => /((?:core|providers|ui|plugins).+)/.exec(doc)[1]
  .replace('/readme.md', '');

const extractComponentDocId = (doc) => `components/${extractComponentDocCategory(doc)}/readme`;

const buildComponentsSideBarItems = () => {
  const sidebarItems = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const doc of getComponentsDocs()) {
    let pointer = sidebarItems;
    let hierarchy = extractComponentDocCategory(doc);
    hierarchy = hierarchy.substr(0, hierarchy.lastIndexOf('/')).split('/').reverse();

    while (hierarchy.length) {
      const subcategoryId = hierarchy.pop();
      const label = formatSideBarLabel(subcategoryId);

      let subcategory = pointer.find((c) => c.label === label);
      if (subcategory === undefined) {
        subcategory = {
          type: 'category',
          label,
          items: [],
        };

        pointer.push(subcategory);
      }

      pointer = subcategory.items;
    }

    pointer.push(extractComponentDocId(doc));
  }

  return sidebarItems;
};

module.exports = {
  formatSideBarLabel,
  getComponentsDocs,
  extractComponentDocId,
  extractComponentDocCategory,
  buildComponentsSideBarItems,
};
