const { readdirSync } = require('fs');
const { resolve } = require('path');

// Thanks to copy-pasta from https://stackoverflow.com/a/45130990.
function* getComponents(dir = resolve(__dirname, '../docs/components')) {
  const entries = readdirSync(dir, { withFileTypes: true });

  // eslint-disable-next-line no-restricted-syntax
  for (const entry of entries) {
    const path = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      yield* getComponents(path);
    } else {
      yield path;
    }
  }
}

const formatSidebarLabel = (name) => name
  .toLowerCase()
  .replace('vm-', '')
  .replace(/(?:^|-)\w/g, (match) => match.toUpperCase())
  .replace(/-/g, '')
  .replace('Ui', 'UI');

const extractSubPath = (component) => /(?:components\/)(.+)/.exec(component)[1];

const extractCategory = (component) => {
  const path = extractSubPath(component);
  return path.substr(0, path.lastIndexOf('/'));
};

// slice .md off
const extractId = (component) => `components/${extractSubPath(component).slice(0, -3)}`;

const buildComponentsSideBarItems = () => {
  const sidebarItems = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const component of getComponents()) {
    let pointer = sidebarItems;
    let hierarchy = extractCategory(component);
    hierarchy = hierarchy.split('/').reverse();

    while (hierarchy.length) {
      const subcategoryId = hierarchy.pop();
      const label = formatSidebarLabel(subcategoryId);

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

    pointer.push(extractId(component));
  }

  return sidebarItems;
};

module.exports = {
  formatSidebarLabel,
  getComponents,
  extractId,
  extractCategory,
  buildComponentsSideBarItems,
};
