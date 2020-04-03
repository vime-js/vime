const SIDEBAR_ORDER = {
  Packages: {
    'Html 5': [
      'Audio',
      'Video',
    ],
    Youtube: [
      'Lite',
      'Standard',
    ],
    Vimeo: [
      'Lite',
      'Standard',
    ],
    Dailymotion: [
      'Lite',
      'Standard',
    ],
    Player: [
      'Audio',
      'Video',
      'Youtube',
      'Dailymotion',
      'Vimeo',
    ]
  }
};

const getValueForPath = (story) => {
  const pathParts = story[1].kind.split('/');
  let value = 0;
  let subLevel = SIDEBAR_ORDER;
  pathParts.forEach((part) => {
    if (!subLevel) return;
    const isLeaf = Array.isArray(subLevel);
    const order = isLeaf ? subLevel : Object.keys(subLevel);
    value += order.findIndex((p) => p === part);
    subLevel = isLeaf ? null : subLevel[part];
  });
  return value;
};

const orderComparator = (a, b) => getValueForPath(a) > getValueForPath(b);
const isSameKind = (a, b) => a[1].kind === b[1].kind;

export default (a, b) => (isSameKind(a, b) ? 0 : orderComparator(a, b));
