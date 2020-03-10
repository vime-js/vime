export default { title: 'Player (Mobile)' };
import * as DesktopStory from './player.desktop.stories';

const forceMobile = Story => ({
  ...Story(),
  props: {
    ...Story().props,
    isMobile: true
  }
});

export const Html5Audio = () => forceMobile(DesktopStory.Html5Audio);
export const Html5Video = () => forceMobile(DesktopStory.Html5Video);
export const Youtube = () => forceMobile(DesktopStory.Youtube);
export const Dailymotion = () => forceMobile(DesktopStory.Dailymotion);
export const Vimeo = () => forceMobile(DesktopStory.Vimeo);