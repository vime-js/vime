import Menu from '../Menu.svelte'

describe('components', () => {
  describe('Menu', () => {
    it('should look structurally correct', () => {
      expect(Menu).toMatchRenderedSnapshot()
    })

    it('should look structurally correct given backButton', () => {
      expect(Menu).toMatchRenderedWithContextSnapshot({
        backButton: {
          title: 'Back Button',
          onClick: () => {}
        }
      })
    })

    it('should look structurally correct given menu items', () => {
      expect(Menu).toMatchRenderedWithContextSnapshot({
        items: [
          {
            title: '#1',
            value: '#1',
            showForwardArrow: true,
            disabled: false,
            ariaControls: 'menu-1',
            ariaExpanded: false,
            onClick: () => {}
          },
          {
            title: '#2',
            value: '#2',
            showForwardArrow: true,
            disabled: false,
            ariaControls: 'menu-2',
            ariaExpanded: false,
            onClick: () => {}
          }
        ]
      })
    })

    it('should look structurally correct given menu radio items', () => {
      expect(Menu).toMatchRenderedWithContextSnapshot({
        backButton: {
          title: 'Back Button',
          onClick: () => {}
        },
        items: [
          { title: '#1', badge: '#1', isChecked: false, onClick: () => {} },
          { title: '#2', badge: '#2', isChecked: false, onClick: () => {} }
        ]
      })
    })
  })
})
