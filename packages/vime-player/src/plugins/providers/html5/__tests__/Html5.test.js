import { render, act } from '@testing-library/svelte'

import MediaType from '~src/MediaType'
import Html5, { canPlay } from '../Html5.svelte'

describe('providers', () => {
  describe('Html5', () => {
    const file = ext => `https://someurl.com/somefile.${ext}`
    const audioFile = file('mp3')
    const videoFile = file('mp4')
    const noop = () => {}

    const enableNativelHls = () => {
      jest.mock('../../utils/support.js', () => ({ can_play_hls_natively: true }))
    }

    const mediaEvents = [
      'loadedmetadata',
      'progress',
      'playing',
      'seeking',
      'seeked',
      'error',
      'waiting',
      'ended'
    ]

    const videoEvents = [
      'enterpictureinpicture', 'leavepictureinpicture', 'webkitpresentationmodechanged'
    ].concat(mediaEvents)

    const mediaSpy = (prop, type) => jest.spyOn(window.HTMLMediaElement.prototype, prop, type)
    const fireMediaEvent = event => mediaAddEvent.mock.calls.find(e => e[0] === event)[1]()

    const mediaLoad = mediaSpy('load').mockImplementation(noop)
    const mediaAddEvent = mediaSpy('addEventListener').mockImplementation(noop)
    const mediaRemoveEvent = mediaSpy('removeEventListener').mockImplementation(noop)

    beforeEach(() => { jest.clearAllMocks() })

    describe('canPlay', () => {
      it('should return true given any audio extension', () => {
        expect(canPlay(audioFile)).toBeTruthy()
      })

      it('should return true given any video extension', () => {
        expect(canPlay(videoFile)).toBeTruthy()
      })

      it('should return true given an hls extension if it can play it natively', () => {
        jest.resetModules()
        enableNativelHls()
        const { canPlay } = require('../Html5.svelte')
        const src = file('m3u8')
        expect(canPlay(src)).toBeTruthy()
        jest.resetModules()
      })

      it('should return false given an hls extension if it can not play it natively', () => {
        const src = file('m3u8')
        expect(canPlay(src)).toBeFalsy()
      })

      it('should return true given an array of sources', () => {
        const src = [videoFile, videoFile]
        expect(canPlay(src)).toBeTruthy()
      })

      it('should return true given an array of sources as long as one can be played', () => {
        const src = [file('invalidExt'), videoFile]
        expect(canPlay(src)).toBeTruthy()
      })

      it('should return true given an array containing a src object', () => {
        const src = [{ src: videoFile }]
        expect(canPlay(src)).toBeTruthy()
      })

      it('should allow extended checks', () => {
        expect(canPlay('', () => true)).toBeTruthy()
        expect(canPlay([''], () => true)).toBeTruthy()
      })
    })

    describe('config', () => {
      it('should load an audio element for a video file given forceAudio is true', async () => {
        const config = { forceAudio: true }
        const { component } = render(Html5, { config })
        await act(() => component.loadMedia(videoFile))
        expect(await component.getRef()).toBeInstanceOf(window.HTMLAudioElement)
        expect(mediaLoad).toHaveBeenCalledTimes(1)
      })

      it('should load a video element for a audio file given forceVideo is true', async () => {
        const config = { forceVideo: true }
        const { component } = render(Html5, { config })
        await act(() => component.loadMedia(audioFile))
        expect(await component.getRef()).toBeInstanceOf(window.HTMLVideoElement)
        expect(mediaLoad).toHaveBeenCalledTimes(1)
      })
    })

    describe('audio', () => {
      it('should render a audio element', async () => {
        const { container, component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        expect(container.querySelector('audio')).not.toBeNull()
      })

      it('should render a source element and call media.load()', async () => {
        const { container, component } = render(Html5)
        await act(() => act(() => component.loadMedia(audioFile)))
        expect(container.querySelector('source')).toHaveAttribute('src', audioFile)
        expect(mediaLoad).toHaveBeenCalledTimes(1)
      })

      it('should return audio when calling getMediaType', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        expect(component.getMediaType()).toBe(MediaType.AUDIO)
      })

      it('should bind all event listeners', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        expect(mediaAddEvent).toHaveBeenCalledTimes(mediaEvents.length)
        mediaEvents.forEach(event => {
          expect(mediaAddEvent.mock.calls.some(call => call[0] === event)).toBeTruthy()
        })
      })

      it('should remove all event listeners when destroyed', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        component.$destroy()
        expect(mediaRemoveEvent).toHaveBeenCalledTimes(mediaEvents.length)
        mediaEvents.forEach(event => {
          expect(mediaRemoveEvent.mock.calls.some(call => call[0] === event)).toBeTruthy()
        })
      })
    })

    describe('video', () => {
      it('should render a video element', async () => {
        const { container, component } = render(Html5)
        await act(() => component.loadMedia(videoFile))
        expect(container.querySelector('video')).not.toBeNull()
      })

      it('should render a source element and call media.load()', async () => {
        const { container, component } = render(Html5)
        await act(() => act(() => component.loadMedia(videoFile)))
        expect(container.querySelector('source')).toHaveAttribute('src', videoFile)
        expect(mediaLoad).toHaveBeenCalledTimes(1)
      })

      it('should return video when calling getMediaType', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(videoFile))
        expect(component.getMediaType()).toBe(MediaType.VIDEO)
      })

      it('should bind all event listeners', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(videoFile))
        expect(mediaAddEvent).toHaveBeenCalledTimes(videoEvents.length)
        videoEvents.forEach(event => {
          expect(mediaAddEvent.mock.calls.some(call => call[0] === event)).toBeTruthy()
        })
      })

      it('should remove all event listeners when destroyed', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(videoFile))
        component.$destroy()
        expect(mediaRemoveEvent).toHaveBeenCalledTimes(videoEvents.length)
        videoEvents.forEach(event => {
          expect(mediaRemoveEvent.mock.calls.some(call => call[0] === event)).toBeTruthy()
        })
      })

      describe('quality', () => {
        const src = [
          { src: file('1080p.mp4'), type: 'video/mp4', quality: '1080p' },
          { src: file('720p.mp4'), type: 'video/mp4', quality: '720p' }
        ]

        it('shoud load initial quality', async () => {
          const { container, component } = render(Html5)
          await act(() => act(() => component.loadMedia(src)))
          const source = container.querySelector('source')
          expect(source).toHaveAttribute('src', src[0].src)
          expect(source).toHaveAttribute('type', src[0].type)
          expect(mediaLoad).toHaveBeenCalledTimes(1)
        })

        it('should load new quality when changed', async () => {
          const { container, component } = render(Html5)
          await act(() => act(() => component.loadMedia(src)))
          expect(mediaLoad).toHaveBeenCalledTimes(1)
          await act(() => component.setQuality(src[1].quality))
          const source = container.querySelector('source')
          expect(source).toHaveAttribute('src', src[1].src)
          expect(source).toHaveAttribute('type', src[1].type)
          expect(mediaLoad).toHaveBeenCalledTimes(2)
        })

        it(
          'should set currentTime and paused to previous state prior to loading new quality',
          async () => {
            const { component } = render(Html5)
            await act(() => act(() => component.loadMedia(src)))
            const mediaPlay = mediaSpy('play').mockImplementation(noop)
            const currentTime = mediaSpy('currentTime', 'set')
            mediaSpy('paused', 'get').mockReturnValue(false)
            mediaSpy('currentTime', 'get').mockReturnValue(100)
            await act(() => component.setQuality(src[1].quality))
            fireMediaEvent('loadedmetadata')
            expect(mediaPlay).toHaveBeenCalledTimes(1)
            expect(currentTime).toHaveBeenCalledWith(100)
          })
      })
    })

    describe('media change', () => {
      it('should destroy all old event bindings and rebind them', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        expect(mediaAddEvent).toHaveBeenCalledTimes(mediaEvents.length)
        expect(mediaRemoveEvent).toHaveBeenCalledTimes(0)
        await act(() => component.loadMedia(videoFile))
        expect(mediaAddEvent).toHaveBeenCalledTimes(videoEvents.length + mediaEvents.length)
        expect(mediaRemoveEvent).toHaveBeenCalledTimes(mediaEvents.length)
      })

      it('should destroy all old event bindings and not rebind them when src is null', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        expect(mediaAddEvent).toHaveBeenCalledTimes(mediaEvents.length)
        expect(mediaRemoveEvent).toHaveBeenCalledTimes(0)
        await act(() => component.loadMedia(null))
        expect(mediaAddEvent).toHaveBeenCalledTimes(mediaEvents.length)
        expect(mediaRemoveEvent).toHaveBeenCalledTimes(mediaEvents.length)
      })
    })

    describe('onBuffered', () => {
      const mediaBuffered = mediaSpy('buffered', 'get')
      const mediaDuration = mediaSpy('duration', 'get')

      it('should return 0 when buffered length is 0', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        component.$on('buffered', e => { expect(e.detail).toBe(0) })
        mediaBuffered.mockReturnValue({ length: 0 })
        fireMediaEvent('progress')
      })

      it('should return buffered if buffered is less than duration', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        component.$on('buffered', e => { expect(e.detail).toBe(10) })
        mediaBuffered.mockReturnValue({ end: () => 10 })
        mediaDuration.mockReturnValue(20)
        fireMediaEvent('progress')
      })

      it('should return duration if buffered is greater than duration', async () => {
        const { component } = render(Html5)
        await act(() => component.loadMedia(audioFile))
        component.$on('buffered', e => { expect(e.detail).toBe(10) })
        mediaBuffered.mockReturnValue({ end: () => 20 })
        mediaDuration.mockReturnValue(10)
        fireMediaEvent('progress')
      })
    })
  })
})
