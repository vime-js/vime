```tsx {11}
class Example {
  render() {
    return (
      <vime-player>
        {/* ... */}
        <vime-ui>
          {/* ... */}
          <vime-controls fullWidth>
            <vime-playback-control />
            <vime-volume-control />
            <vime-control-spacer />
            <vime-fullscreen-control />
          </vime-controls>
        </vime-ui>
      </vime-player>
    );
  }
}
```