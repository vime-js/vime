```tsx {17-24}
class Example {
  @State() value = '1';

  private onValueChange(event: Event) {
    const radio = event.target as HTMLVmMenuRadioElement;
    this.value = radio.value;
  }

  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-settings>
            <vm-submenu label="Playback Rate">
              <vm-menu-radio-group 
                value={this.value} 
                onVmCheck={this.onValueChange.bind(this)}
              >
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