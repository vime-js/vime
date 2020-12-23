```tsx {10-16}
class Example {
  @State() value = 50;

  private onValueChange(event: CustomEvent<number>) {
    this.value = event.detail;
  };

  render() {
    return (
      <Slider
        label="Volume"
        step={5}
        max={100}
        value={this.value}
        onVmValueChange={this.onValueChange.bind(this)}
      />
    );
  }
}
```