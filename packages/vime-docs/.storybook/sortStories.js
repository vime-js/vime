const SIDEBAR_ORDER = {
  Overview: [
    'Introduction',
    'Getting Started'
  ],
  Packages: {
    Preview: [
      'Getting Started',
      'Components'
    ],
    'Html 5': {
      'Getting Started': null,
      Components: [
        'Audio',
        'Video'
      ]
    },
    'Youtube': {
      'Getting Started': null,
      Components: [
        'Lite',
        'Standard'
      ]
    },
    Vimeo: null,
    Dailymotion: null,
    Player: null
  },
  Guides: [
    'Setting Src',
    'Creating a Plugin',
    'Creating a Control',
    'Creating a Provider'
  ],
  API: [
    'Lite Player',
    'Player',
    'Registry',
    'Media Type',
    'Player State'
  ]
}

const getValueForPath = story => {
  const pathParts = story[1].kind.split('/');
  let value = 0;
  let subLevel = SIDEBAR_ORDER;
  pathParts.forEach(part => {
    if (!subLevel) return;
    const isLeaf = Array.isArray(subLevel);
    const order = isLeaf ? subLevel : Object.keys(subLevel);
    value += order.findIndex(p => p === part);
    subLevel = isLeaf ? null : subLevel[part];
  })
  return value;
};

const orderComparator = (a, b) => getValueForPath(a) > getValueForPath(b);
const isSameKind = (a, b) => a[1].kind === b[1].kind;

export default (a, b) => isSameKind(a, b) ? 0 : orderComparator(a, b);
