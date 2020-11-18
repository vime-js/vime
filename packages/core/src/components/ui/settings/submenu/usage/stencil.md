```tsx {8-10}
class Example {
  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-settings>
            <vm-submenu label="Title">{/* ... */}</vm-submenu>
          </vm-settings>
        </vm-ui>
      </vm-player>
    );
  }
}
```