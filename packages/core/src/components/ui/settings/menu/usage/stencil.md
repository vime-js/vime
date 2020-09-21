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
      <vime-player>
        {/* ... */}
        <vime-ui>
          {/* ... */}
          <vime-menu
            identifer="menu-id"
            controller="menu-controller-id"
            active={this.isMenuActive}
            onVOpen={this.onOpen.bind(this)}
            onVClose={this.onClose.bind(this)}
          >
            {/* ... */}
          </vime-menu>
        </vime-ui>
      </vime-player>
    );
  }
}
```