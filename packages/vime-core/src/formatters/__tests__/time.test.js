import { formatTime } from '..'

describe('formatters', () => {
  describe('time', () => {
    it('should return h:mm:ss', () => {
      expect(formatTime(3750)).toBe('1:02:30')
    })

    it('should return mm:ss', () => {
      expect(formatTime(250)).toBe('04:10')
    })

    it('should return 00:ss', () => {
      expect(formatTime(30)).toBe('00:30')
    })

    it('should return h:mm:ss given always show hours is true', () => {
      expect(formatTime(30, true)).toBe('0:00:30')
    })
  })
})
