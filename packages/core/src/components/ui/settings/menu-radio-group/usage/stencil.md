```tsx {17-24}
class Example {
  @State() value = '1';

  private onValueChange(event: Event) {
    const radio = event.target as HTMLVimeMenuRadioElement;
    this.value = radio.value;
  }

  render() {
    return (
      <vime-player>
        {/* ... */}
        <vime-ui>
          {/* ... */}
          <vime-settings>
            <vime-submenu label="Playback Rate">
              <vime-menu-radio-group 
                value={this.value} 
                onVCheck={this.onValueChange.bind(this)}
              >
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