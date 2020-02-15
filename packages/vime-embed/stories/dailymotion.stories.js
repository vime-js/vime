import CenterView from './views/CenterView.svelte'
import { DailymotionLite, Dailymotion } from '../src'

export default { title: 'Dailymotion' }

const videoId = 'x3a9qe6'

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: DailymotionLite,
    videoId
  }
})

export const Full = () => ({
  Component: CenterView,
  props: {
    Component: Dailymotion,
    videoId
  }
})
