import { get_current_component } from 'svelte/internal'
import { get } from 'svelte/store'
import * as globalStore from './globalStore'
import { IS_MOBILE, create_prop, watch_touch } from '@vime/utils'

export default function () {
  const component = get_current_component()
  const constructor = component.constructor
  if (constructor.globalStoreAttached) return
  Object.keys(globalStore).forEach(prop => {
    create_prop(constructor, prop, {
      get: () => get(globalStore[prop]),
      set: p => globalStore[prop].set(p)
    })
  })
  globalStore.mobile.set(IS_MOBILE)
  watch_touch(t => { globalStore.touch.set(t) })
  constructor.globalStoreAttached = true
}
