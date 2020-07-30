export interface KeyboardControl {
  /**
   * A pipe (`|`) seperated string of JS key codes, that when caught in a `keydown` event, will
   * trigger a `click` event on the control.
   *
   * @see https://keycode.info
   */
  keyCodes?: string;

  /**
   * If the `keyCodes` prop is provided, this prop can provide a hint to the user inside the
   * tooltip for what keys can be pressed to trigger the control.
   */
  keyboardHint?: string;
}
