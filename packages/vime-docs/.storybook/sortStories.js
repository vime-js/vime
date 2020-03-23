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
    'Vimeo': {
      'Getting Started': null,
      Components: [
        'Lite',
        'Standard'
      ]
    },
    'Dailymotion': {
      'Getting Started': null,
      Components: [
        'Lite',
        'Standard'
      ]
    },
    Player: {
      'Getting Started': null,
      Components: [
        'Audio',
        'Video',
        'Youtube',
        'Dailymotion',
        'Vimeo'
      ],
      Plugins: {
        Introduction: [
          'Getting Started',
          'How it Works'
        ],
        'Boot': null,
        'Icons': null,
        'Poster': null,
        'Scrim': null,
        'Spinner': null,
        'Captions': null,
        'ActionDisplay': null,
        'ClickToPlay': null,
        'DblClickFullscreen': null,
        'Keyboard': [
          'Keyboard',
          'KeyboardShortcut'
        ],
        'Tooltips': [
          'Tooltip',
          'Tooltips'
        ],
        'Controls': { 
          'Controls': null,
          'ControlGroup': null,
          Control: {
            Time: [
              'Time',
              'TimeDivider',
              'CurrentTime',
              'EndTime',
              'TimeProgress'
            ],
            'Control': null,
            'ToggleControl': null,
            'ControlSpacer': null,
            'ControlNewLine': null,
            'LiveIndicator': null,
            'PlaybackControl': null,
            'BigPlaybackControl': null,
            'MuteControl': null,
            'VolumeControl': null,
            'CaptionControl': null,
            'PiPControl': null,
            'FullscreenControl': null,
            'ScrubberControl': null,
            'SettingsControl': null,
            'SeekControl': null,
            'SeekForwardControl': null,
            'SeekBackwardControl': null,
          }
        },
        'Settings': {
          'Settings': null,
          Menu: {
            'Menu': null,
            'MenuControl': null,
            'MenuItem': null,
            'MenuItemRadio': null,
            'MenuOptions': null,
            Submenu: [
              'Submenu',
              'SelectSubmenu'
            ]
          }
        }
      }
    }
  },
  Guides: [
    'Setting Src',
    'Custom Controls',
    'Custom Settings',
    'Creating a Plugin',
    'Creating a Control',
    'Creating a Provider'
  ],
  API: [
    'LitePlayer',
    'Player',
    'Registry',
    'MediaType',
    'VideoQuality',
    'PlayerState',
    'Plugin',
    'PluginRole',
    'PluginsManager'
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
