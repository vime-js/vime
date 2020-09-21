```tsx {11-13}
class Example {
  render() {
    return (
      <vime-player>
        {/* ... */}
        <vime-ui>
          {/* ... */}
          <vime-settings>
            <vime-submenu label="Playback Rate">
              <vime-menu-radio-group value="1">
                <vime-menu-radio label="0.5" value="0.5" />
                <vime-menu-radio label="Normal" value="1" />
                <vime-menu-radio label="2" value="2" />
              </vime-menu-radio-group>
            </vime-submenu>
          </vime-settings>
        </vime-ui>
      </vime-player>
    );
  }
}
```