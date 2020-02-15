import { get, writable } from 'svelte/store'
import { buildPlayerStore } from '@vime/core'
import { private_writable, subscribe, subscribe_until_true } from '@vime/utils'

export default function buildEmbedStore () {
  const videoId = writable(null)
  const lite = private_writable(null)

  const store = buildPlayerStore()
  store.videoId = videoId
  store.lite = lite

  // TODO: set this
  // subscribe_until_true(store.playbackReady, () => {
  //   store.src.set(get(lite).getSrc())
  // })

  return store
}
