```tsx {18-26}
class Example {
  @State() isMenuActive = false;

  private onOpen() {
    this.isMenuActive = true;
  }

  private onClose() {
    this.isMenuActive = false;
  }

  render() {
    return (
      <vm-player>
        {/* ... */}
        <vm-ui>
          {/* ... */}
          <vm-menu
            identifer="menu-id"
            controller="menu-controller-id"
            active={this.isMenuActive}
            onVmOpen={this.onOpen.bind(this)}
            onVmClose={this.onClose.bind(this)}
          >
            {/* ... */}
          </vm-menu>
        </vm-ui>
      </vm-player>
    );
  }
}
```
