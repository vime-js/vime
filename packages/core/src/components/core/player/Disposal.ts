export class Disposal {
  constructor(
    private dispose: (() => void)[] = [],
  ) {}

  add(callback: () => void) {
    this.dispose.push(callback);
  }

  empty() {
    this.dispose.forEach((fn) => fn());
    this.dispose = [];
  }
}
