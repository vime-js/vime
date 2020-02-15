import { act } from '@testing-library/svelte'
import { warn } from '~utils/debug'
import Cues from '../Cues.svelte'

jest.mock('~utils/debug.js')

class Cue {
  constructor (startTime, endTime, text) {
    this.startTime = startTime
    this.endTime = endTime
    this.text = text
  }

  getCueAsHTML () {
    const span = document.createElement('span')
    span.textContent = this.text
    return span
  }
}

window.VTTCue = Cue

describe('components', () => {
  describe('Cues', () => {
    let cues

    const Event = Object.freeze({
      CUE_CHANGE: 'cuechange',
      CUES_LOADED: 'cuesloaded',
      CUES_CHANGE: 'cueschange',
      CUE_ENTER: 'cueenter',
      CUE_EXIT: 'cueexit'
    })

    const render = props => {
      // const results = renderWithContext({
      //   track: null,
      //   currentTime: 0,
      //   Component: Cues,
      //   ...props
      // })
      const results = {}
      listen(results.component, Object.values(Event))
      return results
    }

    beforeEach(() => {
      cues = [
        new Cue(3, 5, '#1 3-5'),
        new Cue(6, 10, '#2 6-10'),
        new Cue(15, 17, '#3 15-17'),
        new Cue(40, 43, '#4 40-43')
      ]
    })

    it('should load cues', () => {
      jest.spyOn(window.HTMLMediaElement.prototype, 'textTracks', 'get').mockReturnValue([{ cues }])
      const trackAddEventSpy = jest.spyOn(window.HTMLTrackElement.prototype, 'addEventListener')
      const { component } = render({ track: { src: '/src' } })

      trackAddEventSpy.mock.calls.pop()[1]() // Fire load event on HTMLTrackElement

      expect(component.toList()).toEqual(cues)
      expect(component).toHaveFiredEventWith(Event.CUES_LOADED, cues)
      expect(component).toHaveFiredEventTimes(Event.CUES_LOADED, 1)
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, cues)
      expect(component).toHaveFiredEventWith(Event.CUE_CHANGE, {
        index: 0,
        cue: cues[0],
        isActive: false,
        content: expect.stringContaining(cues[0].text)
      })
      expect(component).not.toHaveFiredEvent(Event.CUE_ENTER)
      expect(component).not.toHaveFiredEvent(Event.CUE_EXIT)
    })

    it('should add a cue', () => {
      const { component } = render()
      const list = component.toList()

      component.addCue(cues[0])

      const expectedCurrentCue = {
        index: 0,
        cue: cues[0],
        isActive: false,
        content: expect.stringContaining(cues[0].text)
      }

      expect(list).toEqual([cues[0]])
      expect(list).toHaveLength(1)
      expect(component.getCurrentCue()).toEqual(expectedCurrentCue)
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, [cues[0]])
      expect(component).toHaveFiredEventTimes(Event.CUES_CHANGE, 1)
      expect(component).toHaveFiredEventWith(Event.CUE_CHANGE, expectedCurrentCue)
    })

    it('should fail adding a cue if invalid', () => {
      const { component } = render()
      const list = component.toList()

      component.addCue({})

      expect(warn).toHaveBeenCalledWith(expect.stringMatching(/Cues :: invalid cue/))
      expect(list).toEqual([])
      expect(list).toHaveLength(0)
      expect(component).not.toHaveFiredEvent(Event.CUES_CHANGE)
      expect(component).not.toHaveFiredEvent(Event.CUE_CHANGE)
    })

    it('should add all cues', () => {
      const { component } = render()
      const list = component.toList()

      component.addCues(cues)

      expect(list).toEqual(cues)
      expect(list).toHaveLength(cues.length)
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, cues)
      expect(component).toHaveFiredEventTimes(Event.CUES_CHANGE, cues.length)
      expect(component).toHaveFiredEventWith(Event.CUE_CHANGE, {
        index: 0,
        cue: cues[0],
        isActive: false,
        content: expect.stringContaining(cues[0].text)
      })
      expect(component).not.toHaveFiredEvent(Event.CUE_ENTER)
      expect(component).not.toHaveFiredEvent(Event.CUE_EXIT)
    })

    it('should add cue in correct position', () => {
      const { component } = render()
      const list = component.toList()

      component.addCues(cues)

      // start
      const cueA = new Cue(0, 2, '#A 0-2')
      component.addCue(cueA)
      expect(list).toEqual([cueA, cues[0], cues[1], cues[2], cues[3]])

      // middle
      const cueB = new Cue(11, 13, '#B 11-13')
      component.addCue(cueB)
      expect(list).toEqual([cueA, cues[0], cues[1], cueB, cues[2], cues[3]])

      // end
      const cueC = new Cue(50, 55, '#C 50-55')
      component.addCue(cueC)
      expect(list).toEqual([cueA, cues[0], cues[1], cueB, cues[2], cues[3], cueC])
    })

    it('should remove a cue', () => {
      const { component } = render()
      const list = component.toList()

      component.addCues(cues)
      component.removeCue(cues[0])

      const newCues = [cues[1], cues[2], cues[3]]
      expect(list).toEqual(newCues)
      expect(list).toHaveLength(newCues.length)
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, cues)
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, newCues)
      expect(component).toHaveFiredEventTimes(Event.CUES_CHANGE, cues.length + 1)
    })

    it('should remove all cues', () => {
      const { component } = render()
      const list = component.toList()

      component.addCues(cues)
      component.removeAllCues()

      expect(list).toEqual([])
      expect(list).toHaveLength(0)
      expect(component.getCurrentCue()).toEqual({
        index: -1,
        cue: null,
        isActive: false,
        content: null
      })
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, cues)
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, [])
      expect(component).toHaveFiredEventTimes(Event.CUES_CHANGE, cues.length + 1)
    })

    it('should reset if track is set to null', async () => {
      const { component } = render()
      const list = component.toList()

      component.track = ''
      component.addCues(cues)
      component.track = null

      expect(list).toEqual([])
      expect(list).toHaveLength(0)
      expect(component.getCurrentCue()).toEqual({
        index: -1,
        cue: null,
        isActive: false,
        content: null
      })
      expect(component).toHaveFiredEventWith(Event.CUES_CHANGE, [])
    })

    it('should keep reference to the same array when calling toList', () => {
      const { component } = render()
      const list = component.toList()

      component.addCues(cues)
      expect(list).toEqual(cues)

      component.removeCue(cues[1])
      expect(list).toEqual([cues[0], cues[2], cues[3]])

      component.removeAllCues()
      expect(list).toEqual([])
    })

    it('should update active cue when current time moves forward', async () => {
      let currentCue

      const { component, container } = render()
      component.addCues(cues)

      // Set cue 0
      await act(() => { component.currentTime = 4 })
      currentCue = component.getCurrentCue()
      expect(currentCue).toEqual({
        index: 0,
        cue: cues[0],
        isActive: true,
        content: expect.anything()
      })
      expect(component).toHaveFiredEventWith(Event.CUE_ENTER, currentCue)
      expect(component).not.toHaveFiredEvent(Event.CUE_EXIT)

      // Set cue 1
      await act(() => { component.currentTime = 6 })
      expect(component).toHaveFiredEventWith(Event.CUE_EXIT, {
        ...currentCue,
        isActive: false
      })
      currentCue = component.getCurrentCue()
      expect(currentCue).toEqual({
        index: 1,
        cue: cues[1],
        isActive: true,
        content: expect.anything()
      })
      expect(component).toHaveFiredEventWith(Event.CUE_ENTER, currentCue)

      // Set cue 3
      await act(() => { component.currentTime = 41 })
      expect(component).toHaveFiredEventWith(Event.CUE_EXIT, {
        ...currentCue,
        isActive: false
      })
      currentCue = component.getCurrentCue()
      expect(currentCue).toEqual({
        index: 3,
        cue: cues[3],
        isActive: true,
        content: expect.anything()
      })
      expect(component).toHaveFiredEventWith(Event.CUE_ENTER, currentCue)
    })

    it('should update active cue when current time moves backward', async () => {
      let currentCue

      const { component, container } = render()
      component.addCues(cues)

      // Set cue 3
      await act(() => { component.currentTime = 41 })
      currentCue = component.getCurrentCue()
      expect(component.getCurrentCue()).toEqual({
        index: 3,
        cue: cues[3],
        isActive: true,
        content: expect.anything()
      })
      expect(component).toHaveFiredEventWith(Event.CUE_ENTER, currentCue)

      // Set cue 1
      await act(() => { component.currentTime = 8 })
      expect(component).toHaveFiredEventWith(Event.CUE_EXIT, {
        ...currentCue,
        isActive: false
      })
      currentCue = component.getCurrentCue()
      expect(currentCue).toEqual({
        index: 1,
        cue: cues[1],
        isActive: true,
        content: expect.anything()
      })
      expect(component).toHaveFiredEventWith(Event.CUE_ENTER, currentCue)
    })

    it('should look structurally correct when there is no active cue', async () => {
      const { container, context } = render()
      await act(() => { context.isCaptionsEnabled.set(true) })
      expect(container.firstChild).toMatchSnapshot()
    })

    it('should look structurally correct when there is a active cue', async () => {
      const { container, component, context } = render()
      component.addCues(cues)

      await act(() => {
        context.isCaptionsEnabled.set(true)
        component.currentTime = cues[0].startTime
      })

      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
