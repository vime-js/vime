import { load_script, load_image, load_sdk, sdkRequests } from '../load'

describe('utils', () => {
  describe('load', () => {
    describe('load_script', () => {
      // Arbitrary lightweight script.
      const src = 'https://unpkg.com/mitt/dist/mitt.umd.js'

      beforeEach(() => {
        const script = document.createElement('script')
        document.body.appendChild(script)
      })

      it('should load script and insert before first script tag', done => {
        const onError = jest.fn()
        load_script(src, () => {
          expect(window.mitt).not.toBeUndefined()
          expect(onError).toHaveBeenCalledTimes(0)
          done()
        }, onError)
        const expectedBody = `<script src="${src}"></script><script></script>`
        expect(document.body.innerHTML).toContain(expectedBody)
      })
    })

    describe('load_image', () => {
      const src = 'https://i.ytimg.com/vi/mN0zPOpADL4/hqdefault.jpg'

      it('should load an image', () => {
        return load_image(src, 121).then(image => {
          expect(image.src).toBe(src)
        })
      })

      it('should reject image given the image width is not valid', done => {
        load_image(src, 481).catch(image => { done() })
      })
    })

    describe('load_sdk', () => {
      const src = 'https://www.youtube.com/iframe_api'
      const id = 'YT'
      const readyCallbackId = 'onYouTubeIframeAPIReady'

      const load = () => load_sdk(src, id, readyCallbackId)

      beforeEach(() => {
        window[id] = undefined
        window[readyCallbackId] = undefined
        Object.keys(sdkRequests).forEach(key => delete sdkRequests[key])
      })

      it('should load an sdk', async () => {
        const getSDK = load()
        jest.spyOn(window, readyCallbackId)
        const sdk = await getSDK
        expect(sdk.Player).not.toBeUndefined()
        expect(window[id].Player).toBe(sdk.Player)
        expect(window[readyCallbackId]).toHaveBeenCalledTimes(1)
      })

      it('should resolve immediately if the sdk is available', async () => {
        const sdk = jest.fn()
        window[id] = sdk
        const getSDK = load()
        expect(window[readyCallbackId]).toBeUndefined()
        const SDK = await getSDK
        expect(SDK).toBe(sdk)
        expect(window[id]).toBe(sdk)
        expect(Object.keys(sdkRequests)).toHaveLength(0)
      })

      it('should add all requests to a pending queue and resolve them all', async () => {
        const firstRequest = load()
        expect(Object.keys(sdkRequests)).toHaveLength(1)
        expect(sdkRequests[src]).toHaveLength(1)
        const secondRequest = load()
        expect(Object.keys(sdkRequests)).toHaveLength(1)
        expect(sdkRequests[src]).toHaveLength(2)
        await expect(firstRequest).resolves.toBeDefined()
        await expect(secondRequest).resolves.toBeDefined()
      })

      it('should call an existing ready callback', async () => {
        const onReady = jest.fn()
        window[readyCallbackId] = onReady
        await load()
        expect(onReady).toHaveBeenCalledTimes(1)
      })
    })
  })
})
