import MenuItem from '../MenuItem.svelte'

describe('components', () => {
  describe('MenuItem', () => {
    it('should look structurally correct with forward arrow', () => {
      expect(MenuItem).toMatchRenderedWithContextSnapshot({
        title: 'Title',
        showForwardArrow: true,
        ariaControls: 'menu'
      })
    })

    it('should look structurally correct with back arrow', () => {
      expect(MenuItem).toMatchRenderedWithContextSnapshot({
        title: 'Title',
        showBackArrow: true
      })
    })
  })
})
