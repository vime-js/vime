```tsx {8-10,12-15}
class Example {
  render() {
    return (
      <vime-player>
        {/* ... */}
        <vime-ui>
          <vime-controls fullWidth>
            <vime-control-group>
              <vime-scrubber-control />
            </vime-control-group>

            <vime-control-group space="top">
              <vime-playback-control />
              <vime-volume-control />
            </vime-control-group>
          </vime-controls>
        </vime-ui>
      </vime-player>
    );
  }
}
```