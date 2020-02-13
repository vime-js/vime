<Cues 
  {currentTime}
  {crossOrigin}
  track={currentTrack}
  on:cuesloaded
  on:cuechange
  on:cueschange
  on:cueenter
  on:cueexit
  bind:this={cues}
/>

<script context="module">
  import PluginRole from '~src/core/PluginRole'

  export const ID = 'vTracks'
  export const ROLE = PluginRole.CAPTIONS

  const isTracksEqual = (tA, tB) => tA.kind === tB.kind &&
    tA.label === tB.label &&
    tA.srclang === tB.srclang
</script>

<script>
  import { createEventDispatcher } from 'svelte'
  import { get_current_component } from 'svelte/internal'
  import { warn } from '~utils/debug'
  import { is_number } from '~utils/unit'
  import { create_prop } from '~utils/object'
  import PlayerEvent from '~src/PlayerEvent'
  import Cues from './Cues.svelte'

  // isCaptionsEnabled: writable(true),
  // isCaptionsSupported: privateWritable(false),
  // isCaptionsActive: writable(false),

  const self = get_current_component()
  const dispatch = createEventDispatcher()

  const tracks = []
  let cues = null
  let currentTrack = null

  export let locale
  export let currentTime
  export let crossOrigin

  create_prop(self, 'cues', { get: () => cues })

  const validateTrack = track => {
    const validKinds = ['captions', 'subtitles']
    if (tracks.some(t => isTracksEqual(t, track))) {
      warn(
        `Tracks :: invalid track [${track.src}] found, there cannot be more than one track with ` +
        'the same kind, label and srclang'
      )
      return false
    }
    if (
      !track ||
      !track.kind ||
      !track.src ||
      !track.label ||
      !track.srclang
    ) {
      warn(
        `Tracks :: invalid track [${track.src}] found, must have src, kind (subtiles/captions), ` +
        'label and srclang properties set'
      )
      return false
    }
    if (!validKinds.includes(track.kind)) {
      warn(
        `Tracks :: invalid track [${track.src}] found, only subtitles and captions are supported ` +
        'at this time'
      )
      return false
    }
    return true
  }

  const onTracksChange = () => dispatch(PlayerEvent.TRACKS_CHANGE, [...tracks])

  export const toList = () => tracks

  export const getCurrentTrack = () => ({
    index: tracks.findIndex(t => t === currentTrack),
    track: currentTrack
  })
  
  export const setCurrentTrack = track => {
    const newTrack = is_number(track) ? tracks[track] : tracks.find(t => isTracksEqual(t, track))
    if (!newTrack || currentTrack === newTrack) return
    currentTrack = newTrack
  }

  export const addTrack = track => {
    if (!validateTrack(track)) return
    tracks.push(track)
    onTracksChange()
    if (!currentTrack) findCurrentTrack()
  }

  export const addTracks = tracks => {
    tracks.map(addTrack)
    if (!currentTrack) findCurrentTrack()
  }

  export const removeTrack = track => {
    const index = is_number(track) ? track : tracks.findIndex(t => isTracksEqual(t, track))
    if (index <= 0 || index >= tracks.length) {
      warn(
        'Tracks :: could not remove track because it could not be found or index was out of bounds'
      )
      return
    }
    if (getCurrentTrack().index === index) currentTrack = null
    tracks.splice(index, 1)
    onTracksChange()
  }

  export const removeAllTracks = () => {
    tracks.splice(0, tracks.length)
    onTracksChange()
    currentTrack = null
  }

  const findTrackByLocale = () => tracks.find(t => t.srclang === locale)

  const findCurrentTrack = () => {
    if (!currentTrack) currentTrack = findTrackByLocale()
    if (!currentTrack) currentTrack = tracks.find(t => t.default)
  }

  $: if (!currentTrack && tracks.length > 0) findCurrentTrack()
  $: if (locale) currentTrack = findTrackByLocale()
  $: currentTrack && dispatch(PlayerEvent.TRACK_CHANGE, getCurrentTrack())
</script>