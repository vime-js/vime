```tsx {8,11}
class Example {
  render() {
    return (
      {/* Change the icons property to the name of the library you'd like to use. */}
      <vm-player icons="material">
        {/* ... */}
        <vm-ui>
          {/* Register a custom icon library. */}
          <vm-icon-library name="my-library" resolver={(iconName) => `/icons/${iconName}.svg`} />
        </vm-ui>
      </vm-player>
    );
  }
}
```
