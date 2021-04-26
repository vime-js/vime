```tsx {11-13}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-settings>
            <vm-submenu label="Playback Rate">
              <vm-menu-radio-group value="1">
                <vm-menu-radio label="0.5" value="0.5" />
                <vm-menu-radio label="Normal" value="1" />
                <vm-menu-radio label="2" value="2" />
              </vm-menu-radio-group>
            </vm-submenu>
          </vm-settings>
        </vm-ui>
      </vm-player>
    );
  }
}
```
