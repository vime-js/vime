import { tick, onDestroy, createEventDispatcher } from 'svelte'
import { writable, get } from 'svelte/store'
import { run_all } from 'svelte/internal'
import { make_readonly } from './utils/store'
import EmbedEvent from './EmbedEvent'

let pauseCurrentPlayer = null

export default function store () {
  const ready = writable(false)
  const title = writable('')
  const duration = writable(0)
  const buffered = writable(0)
  const qualities = writable([])
  const quality = writable(null)
  const rates = writable([])
  const rate = writable(null)
  const started = writable(false)
  const ended = writable(false)
  const buffering = writable(false)
  const lite = writable(null)
  const paused = writable(true)
  const playing = writable(false)
  const seeking = writable(false)
  const seeked = writable(false)
  const currentTime = writable(0)
  const muted = writable(false)
  const volume = writable(30)
  const videoId = writable(null)
  const playbackReady = writable(false)
  const autopause = writable(true)

  // TODO: add progress / state (stores + events), srcchange, posterchange
  // move away from videoID to generic src??

  const publicStores = {
    ready,
    title,
    playing,
    seeking,
    playbackReady,
    duration,
    buffered,
    qualities,
    quality,
    rates,
    started,
    ended,
    buffering,
    lite
  }

  Object
    .keys(publicStores)
    .forEach(s => {
      publicStores[s] = make_readonly(publicStores[s])
    })

  let dispose = []
  onDestroy(() => run_all(dispose))

  const onVideoChange = () => {
    paused.set(true)
    playing.set(false)
    seeking.set(false)
    seeked.set(false)
    currentTime.set(0)
    muted.set(false)
    volume.set(30)
    title.set('')
    duration.set(0)
    buffered.set(0)
    buffering.set(false)
    qualities.set([])
    quality.set(null)
    rates.set([])
    rate.set(null)
    started.set(false)
    ended.set(false)
    playbackReady.set(false)
    run_all(dispose)
    dispose = []
    subUntilTrue(playing, () => started.set(true))
    subUntilTrue(ended, () => paused.set(true))
  }

  const dispatch = createEventDispatcher()
  const sub = (store, cb) => onDestroy(store.subscribe(cb))
  const subAndDispatch = (store, event) => sub(store, $v => dispatch(event, $v))
  const subAndDispatchIf = (store, event) => sub(store, $v => $v && dispatch(event, $v))
  const subUntilTrue = (store, cb) => {
    const off = store.subscribe($v => {
      $v && cb($v)
      $v && off()
    })
    dispose.push(off)
  }

  sub(videoId, onVideoChange)
  subAndDispatch(duration, EmbedEvent.DURATION_CHANGE)
  subAndDispatch(currentTime, EmbedEvent.TIME_UPDATE)
  subAndDispatch(rate, EmbedEvent.RATE_CHANGE)
  subAndDispatch(rates, EmbedEvent.RATES_CHANGE)
  subAndDispatch(quality, EmbedEvent.QUALITY_CHANGE)
  subAndDispatch(qualities, EmbedEvent.QUALITIES_CHANGE)
  subAndDispatch(volume, EmbedEvent.VOLUME_CHANGE)
  subAndDispatch(muted, EmbedEvent.MUTE_CHANGE)
  subAndDispatch(buffered, EmbedEvent.BUFFERED)
  subAndDispatchIf(buffering, EmbedEvent.BUFFERING)
  subAndDispatchIf(started, EmbedEvent.PLAYBACK_STARTED)
  subAndDispatchIf(ended, EmbedEvent.PLAYBACK_ENDED)
  subAndDispatchIf(ready, EmbedEvent.READY)
  subAndDispatchIf(playbackReady, EmbedEvent.PLAYBACK_READY)
  subAndDispatchIf(playing, EmbedEvent.PLAYING)

  let didSeek
  let mutedStateBeforeSeeking
  let pausedStateBeforeSeeking
  const onSeeked = async () => {
    if (!didSeek) return
    await tick()
    paused.set(pausedStateBeforeSeeking)
    muted.set(mutedStateBeforeSeeking)
  }

  sub(seeking, $s => {
    if ($s) {
      dispatch(EmbedEvent.SEEKING)
      mutedStateBeforeSeeking = get(muted)
      pausedStateBeforeSeeking = get(paused)
      paused.set(true)
      muted.set(true)
      didSeek = true
    }
  })

  sub(buffering, $b => { if (get(seeking) && !$b) seeked.set(true) })
  sub(buffered, $b => { if (get(seeking) && $b >= get(currentTime)) seeked.set(true) })

  sub(playing, $p => {
    if (get(seeking) && $p) seeked.set(true)
    $p && buffering.set(false)
    paused.set(false)
    if ($p && get(autopause) && pauseCurrentPlayer) pauseCurrentPlayer.set(true)
    pauseCurrentPlayer = paused
    onSeeked()
  })

  sub(paused, $p => {
    $p ? dispatch(EmbedEvent.PAUSE) : dispatch(EmbedEvent.PLAY)
    $p && playing.set(false)
  })

  sub(seeked, $s => {
    if (!get(seeking) || !$s) return
    seeking.set(false)
    buffering.set(false)
    seeked.set(false)
    dispatch(EmbedEvent.SEEKED)
    onSeeked()
  })

  const stores = {
    duration,
    buffered,
    qualities,
    quality,
    rates,
    rate,
    started,
    ended,
    buffering,
    paused,
    currentTime,
    muted,
    volume,
    videoId,
    title,
    lite,
    ready,
    playing,
    seeking,
    playbackReady,
    autopause,
    params: writable({}),
    events: writable({}),
    aspectRatio: writable(null),
    playsinline: writable(true),
    controls: writable(true),
    autoplay: writable(false),
    loop: writable(false)
  }

  return {
    private: stores,
    public: {
      ...stores,
      ...publicStores
    }
  }
}
