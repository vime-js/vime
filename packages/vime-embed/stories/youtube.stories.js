import CenterView from './views/CenterView.svelte'
import { YouTubeLite, YouTube } from '../src'

export default { title: 'YouTube' }

const videoId = 'R6MlUcmOul8'

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: YouTubeLite,
    videoId
  }
})

export const Full = () => ({
  Component: CenterView,
  props: {
    Component: YouTube,
    videoId
  }
})
