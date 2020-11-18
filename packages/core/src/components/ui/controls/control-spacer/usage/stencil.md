```tsx {11}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-controls fullWidth>
            <vm-playback-control />
            <vm-volume-control />
            <vm-control-spacer />
            <vm-fullscreen-control />
          </vm-controls>
        </vm-ui>
      </vm-player>
    );
  }
}
```