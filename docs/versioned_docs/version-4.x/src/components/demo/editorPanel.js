import { Pane } from 'tweakpane';

const buildEditorPanel = ({
  container,
  onColorChange = () => {},
  onDefaultUiChange = () => {},
  onThemeChange = () => {},
  onProviderChange = () => {},
}) => {
  if (typeof container === 'undefined') return null;

  const pane = new Pane({
    title: 'Editor',
    container,
  });

  pane.addInput({ color: '#e86c8b' }, 'color').on('change', onColorChange);

  pane
    .addInput({ theme: 'dark' }, 'theme', {
      options: {
        light: 'light',
        dark: 'dark',
      },
    })
    .on('change', onThemeChange);

  pane
    .addInput({ provider: 'video' }, 'provider', {
      options: {
        audio: 'audio',
        video: 'video',
        youtube: 'youtube',
        vimeo: 'vimeo',
        dailymotion: 'dailymotion',
        hls: 'hls',
        dash: 'dash',
      },
    })
    .on('change', onProviderChange);

  pane
    .addInput({ defaultUi: true }, 'defaultUi')
    .on('change', onDefaultUiChange);

  return pane;
};

export default buildEditorPanel;
