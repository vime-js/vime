import { act } from '@testing-library/svelte'
import { SvelteComponent } from 'svelte/internal'

import { warn } from '~utils/debug'
import Tracks from '../Tracks.svelte'

jest.mock('~utils/debug.js')

describe('components', () => {
  describe('Tracks', () => {
    let tracks

    const Event = Object.freeze({
      TRACK_CHANGE: 'trackchange',
      TRACKS_CHANGE: 'trackschange'
    })

    const render = props => {
      // const results = renderWithContext({
      //   currentTime: 0,
      //   locale: null,
      //   Component: Tracks,
      //   ...props
      // })
      const results = {}
      listen(results.component, Object.values(Event))
      return results
    }

    beforeEach(() => {
      tracks = [{
        default: true,
        kind: 'subtitles',
        label: 'English',
        srclang: 'en',
        src: '/media/video/tracks/en.vtt'
      },
      {
        kind: 'subtitles',
        label: 'Spanish',
        srclang: 'es',
        src: '/media/video/tracks/es.vtt'
      },
      {
        kind: 'subtitles',
        label: 'French',
        srclang: 'fr',
        src: '/media/video/tracks/fr.vtt'
      }]
    })

    it('should add a track', async () => {
      const { component } = render()
      const list = component.toList()

      await act(() => component.addTrack(tracks[0]))

      expect(list).toEqual([tracks[0]])
      expect(list).toHaveLength(1)
      expect(component).toHaveFiredEventWith(Event.TRACKS_CHANGE, [tracks[0]])
      expect(component).toHaveFiredEventWith(Event.TRACK_CHANGE, {
        index: 0,
        track: tracks[0]
      })
    })

    it('should fail adding a track if invalid', () => {
      const { component } = render()
      const list = component.toList()

      delete tracks[0].kind
      component.addTrack(tracks[0])

      expect(warn).toHaveBeenCalledWith(expect.stringMatching(/Tracks :: invalid track/))
      expect(list).toEqual([])
      expect(list).toHaveLength(0)
      expect(component).not.toHaveFiredEvents([Event.TRACKS_CHANGE, Event.TRACKS_CHANGE])
    })

    it('should add all tracks', async () => {
      const { component } = render()
      const list = component.toList()

      await act(() => component.addTracks(tracks))

      expect(list).toEqual(tracks)
      expect(list).toHaveLength(tracks.length)
      expect(component).toHaveFiredEventWith(Event.TRACKS_CHANGE, tracks)
      expect(component).toHaveFiredEventWith(Event.TRACK_CHANGE, {
        index: 0,
        track: tracks[0]
      })
    })

    it('should remove a track', () => {
      const { component } = render()
      const list = component.toList()

      component.addTracks(tracks)
      component.removeTrack(tracks[1])

      const newTracks = [tracks[0], tracks[2]]
      expect(list).toEqual(newTracks)
      expect(list).toHaveLength(newTracks.length)
      expect(component).toHaveFiredEventWith(Event.TRACKS_CHANGE, tracks)
      expect(component).toHaveFiredEventWith(Event.TRACKS_CHANGE, newTracks)
      expect(component).toHaveFiredEventTimes(Event.TRACKS_CHANGE, tracks.length + 1)
    })

    it('should remove all tracks', () => {
      const { component } = render()
      const list = component.toList()

      component.addTracks(tracks)
      component.removeAllTracks()

      expect(list).toEqual([])
      expect(list).toHaveLength(0)
      expect(component).toHaveFiredEventWith(Event.TRACKS_CHANGE, tracks)
      expect(component).toHaveFiredEventWith(Event.TRACKS_CHANGE, [])
      expect(component).toHaveFiredEventTimes(Event.TRACKS_CHANGE, tracks.length + 1)
    })

    it('should set new track if current track is removed', async () => {
      const { component } = render()

      component.addTracks(tracks)
      component.setCurrentTrack(tracks[1])
      await act(() => component.removeTrack(tracks[1]))

      expect(component.getCurrentTrack().track).toEqual(tracks[0])
    })

    it('should set the current track', async () => {
      const { component } = render()

      component.addTracks(tracks)
      await act(() => component.setCurrentTrack(tracks[1]))

      expect(component).toHaveFiredEventWith(Event.TRACK_CHANGE, {
        index: 1,
        track: tracks[1]
      })
    })

    it('should set the default track', async () => {
      const { component } = render()

      await act(() => component.addTracks(tracks))

      expect(component.getCurrentTrack().track).toEqual(tracks[0])
    })

    it('should set the track based on locale if there is no default', async () => {
      const { component } = render()

      component.locale = 'es'
      delete tracks[0]
      await act(() => component.addTracks(tracks))

      expect(component.getCurrentTrack().track).toEqual(tracks[1])
    })

    it('should keep reference to the same array when calling toList', () => {
      const { component } = render()
      const list = component.toList()

      component.addTracks(tracks)
      expect(list).toEqual(tracks)

      component.removeTrack(tracks[1])
      expect(list).toEqual([tracks[0], tracks[2]])

      component.removeAllTracks()
      expect(list).toEqual([])
    })

    it('should change current track on locale change', async () => {
      const { component } = render()

      component.addTracks(tracks)
      await act(() => { component.locale = 'fr' })

      expect(component.getCurrentTrack().track).toEqual(tracks[2])
      expect(component).toHaveFiredEventWith(Event.TRACK_CHANGE, {
        index: 2,
        track: tracks[2]
      })
    })

    it('it should have a cues prop', () => {
      const { component } = render()

      expect(component.cues).toBeDefined()
      expect(component.cues).toBeInstanceOf(SvelteComponent)
    })
  })
})
