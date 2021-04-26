```tsx {8-10,12-15}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          <vm-controls fullWidth>
            <vm-control-group>
              <vm-scrubber-control />
            </vm-control-group>

            <vm-control-group space="top">
              <vm-playback-control />
              <vm-volume-control />
            </vm-control-group>
          </vm-controls>
        </vm-ui>
      </vm-player>
    );
  }
}
```
