```tsx {6,9}
class Example {
  render() {
    return (
      <div>
        {/* Src. */}
        <vm-icon src="/icons/my-icon.svg" label="An icon" />

        {/* Icon library. */}
        <vm-icon name="play" library="material" label="Play" />
      </div>
    );
  }
}
```
