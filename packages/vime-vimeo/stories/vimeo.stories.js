import { CenterView } from '@vime/core'
import { VimeoLite, Vimeo } from '../src'

export default { title: 'Vimeo' }

const srcId = '154225711'

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: VimeoLite,
    srcId
  }
})

export const Full = () => ({
  Component: CenterView,
  props: {
    Component: Vimeo,
    srcId
  }
})
