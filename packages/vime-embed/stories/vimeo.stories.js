import CenterView from './views/CenterView.svelte'
import { VimeoLite, Vimeo } from '../index'

export default { title: 'Vimeo' }

const videoId = '154225711'

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: VimeoLite,
    videoId
  }
})

export const Full = () => ({
  Component: CenterView,
  props: {
    Component: Vimeo,
    videoId
  }
})
