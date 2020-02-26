import { Video as DesktopVideo } from './desktop.stories';

export default { title: 'Mobile' };

const onReady = player => {
  const store = player.getStore();
  store.isMobile.set(true);
};

const createView = (Base, newProps = {}) => ({
  ...Base(),
  props: {
    ...Base().props,
    ...newProps
    // onReady
  }
});

export const Video = () => createView(DesktopVideo);

export const InlineVideo = () => createView(DesktopVideo, { playsinline: true });
