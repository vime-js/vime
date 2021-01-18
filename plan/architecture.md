# Architecture

## Player

```mermaid
classDiagram

class Player {
    +identifer: symbol
    +src: Source[]
    +paused: boolean
    +volume: boolean
    ...
    +autoAspectRatio: boolean
    +autoFetchPoster: boolean
    +heartbeatInterval: number
    +currentProvider?: MediaProvider~any~
    #playerStore: PlayerStore

    #handleMediaChange() void
    #handleProviderChange() void
    +play() Promise~void~ 
    +pause() Promise~void~ 
    +getCaptureStream() MediaStream|undefined
    +getCurrentPlayerState() PlayerState
    +subscribe(state => void, debounceMs?: number) Unsubscribe
}

Player -- ViewType
Player -- MediaType
Player "1" --* "0..*" MediaProvider: composition

class PlayerStore
class Unistore
<<library>>Unistore

PlayerStore --> Unistore: uses
Player --> PlayerStore: has

class PlayerState {
    <<interface>>
    src: Source[]
    currentTime: number
    volume: number
    trim?: MediaTrim
    inViewport: boolean
    ...
}

Player --> PlayerState: implements
PlayerStore --> PlayerState: implements

class MediaTrim {
    <<interface>>
    startTime: number
    endTime: number
    duration: number
}

PlayerState -- MediaTrim
```

### Why `PlayerStore`?

- It provides an easy way to share/save/sync a snapshot of the state of the player at any time.
- Easy to subscribe to changes over-time instead of using multiple event listeners. 
- Easy to time travel and view the state of the player at any time in the past, simply push state 
as it comes through on to a stack.
- The state object is a fresh clone each time it's changed so it's safe for the consumer to mess with.
- Easier to consume from client side when building UI with React Hooks, Svelte Stores or Vue 
Composition API.

## Providers

The player will manage as much functionality as possible to avoid colliding with the provider and for 
consistency. This includes features like `autoplay`, `loop` and even rendering. The provider doesn't 
render anything by default. This enables the Player more control over when it happens opening up 
new features such as the ability to pass in multiple providers in the DOM at the same time 
(player can select provider based on who can play current `src`), and it allows different 
[boot strategies](#boot-strategy) to be used to determine how/when the provider is loaded.

```mermaid
classDiagram

class YouTube
class Vimeo
class Dailymotion
class Embed

YouTube -- Embed: uses
Vimeo -- Embed: uses
Dailymotion -- Embed: uses

class EmbededMediaProvider~ParamsType,MessageType~ {
    <<abstract>>
    #embed?: HTMLVmEmbedElement
    #embedSrc?: string

    getMediaTitle()* string|undefined
    getOrigin()* string
    buildParams()* ParamsType
    getDecoder()* Decoder
    getPreconnections()*
    onEmbedLoaded()*
    onEmbedMessage(CustomEvent~MessageType~ event)*
    onEmbedSrcChange()*
}

EmbededMediaProvider <|-- YouTube: extends
EmbededMediaProvider <|-- Vimeo: extends
EmbededMediaProvider <|-- Dailymotion: extends

class Video
class Audio
class File
class HLS
class DASH

class MediaFileProvider {
    #mediaEl?: HTMLMediaElement
    +crossOrigin?: true | anonymous | credentials
    +preload?: true | none | metadata | auto
    +poster?: string
    +controlsList?: string
    +autoPiP?: string
    +disablePiP?: boolean
    +disableRemotePlayback?: boolean
}

File <|-- Audio: extends
File <|-- Video: extends
MediaFileProvider <|-- File: extends
MediaFileProvider <|-- HLS: extends
MediaFileProvider <|-- DASH: extends

class MediaProvider~InternalPlayerType~ {
    <<abstract>>
    #controls: boolean
    #language: string
    #playsinline:boolean

    play()* Promise~void~
    pause()* Promise~void~
    canPlay(type: string)* void
    loadMedia(src: Source[])* void
    getInternalPlayer()* InternalPlayerType
    getCurrentViewType()* ViewType
    getCurrentMediaType()* MediaType
    setCurrentTime(time: number)* void
    setMuted(muted: boolean)* void
    setVolume(volume: number)* void
    canSetPlaybackRate()* boolean
    setPlaybackRate(rate: number)* void
    canSetPlaybackQuality()* boolean
    setPlaybackQuality(quality: string)* void
    canSetFullscreen()* boolean
    enterFullscreen(options?: FullscreenOptions)* Promise~void~
    exitFullscreen()* Promise~void~
    canSetPiP()* boolean
    enterPiP()* Promise~void~
    exitPiP()* Promise~void~
    setCurrentTextTrack(trackId: number)* void
    setTextTrackVisibility(isVisible: boolean)* void
    getMediaTrimming()* MediaTrim|undefined
    fetchRecommendedAspectRatio()* Promise~string~
    fetchCurrentPoster()* Promise~string~
    fetchCurrentMediaTitle()* Promise~string~
    fetchCurrentMediaDuration()* Promise~number~
    renderPlayer()* HTMLTemplateString
    destroy()* void
    -render() void
}

MediaProvider <|-- MediaFileProvider
MediaProvider <|-- EmbededMediaProvider

class MediaType {
    <<enumeration>>
    AUDIO
    VIDEO
}

class ViewType {
    <<enumeration>>
    AUDIO
    VIDEO
}

MediaType -- MediaProvider
ViewType -- MediaProvider

class Player

Player -- MediaType
Player -- ViewType
Player "1" --* "0..*" MediaProvider: composition
```

## Boot Strategy

```mermaid
classDiagram

class Player {
    ...
    +bootStrategy: click | lazy | immediate | BootStrategy
}

class BootStrategy
<<interface>> BootStrategy
class LazyBootStrategy
class ClickBootStrategy
class ImmediateBootStrategy

BootStrategy <-- LazyBootStrategy: implements
BootStrategy <-- ClickBootStrategy: implements
BootStrategy <-- ImmediateBootStrategy: implements

Player -- BootStrategy: uses
```

## Player Management

```mermaid
classDiagram

class PlayerRegistry
```

## MediaSync

```mermaid
classDiagram

class MediaSync
```

## UI

```mermaid
classDiagram

class UI
```

## Player Update Flow

Using setting the `paused` property to `false` as an example:

- Provider updates the prop -> Player listens for `ProviderPlay` event and updates prop in the 
`PlayerStore`.
- UI updates the prop -> Player listens for `UIPlay` event and updates prop in the 
`PlayerStore` + calls `setPaused(false)` on `currentProvider`. 
- Developer updates prop -> Change is noticed through prop setter and it updates prop in the 
`PlayerStore` + calls `setPaused` on `currentProvider`. A `DevPlay` event may be emitted?

Note: When you are "getting" a property value from the `Player` that is part of `PlayerState` you 
are actually just returning the current value from the `PlayerStore`.

## Questions/Thoughts

- How to handle readonly properties??
- Strict naming convention? paused vs. isPaused?
- Show flows between Player -> Providers
- Show flows between Player → UI.
- Show flows between I18N → UI.
- Show cross component comms Controls → Captions/Settings (Collision detection).
- PlayerEventListener API.
- List all events (System/User) for Furf to make sure we've covered everything.
- Show UI Design patterns (Functional / CSS Classes / Toggle).
- Custom UI on IOS using Canvas?
- Custom PIP mode with Canvas?
- Stream chunks to indexdb?? Maybe save content as part of a session that can be cleared whenever?
- Offline mode? -> OfflineStrategy? -> save for another day?
- Caching -> CacheStrategy?
- Media Session?
- Playlists?? -> most likely external
- Ads? -> What happens to some UI when Ad playing?