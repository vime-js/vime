export interface KeyboardControl {
  /**
   * A slash (`/`) separated string of JS keyboard keys (`KeyboardEvent.key`), that when caught in
   * a `keydown` event, will trigger a `click` event on the control.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
   *
   * @example `f/Esc`
   */
  keys?: string;
}
