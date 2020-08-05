import { getElement } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';

export const findUIRoot = (ref: any) => {
  let ui = getElement(ref);

  while (!(/^VIME-UI$/.test(ui?.nodeName))) {
    ui = ui.parentElement as HTMLStencilElement;
  }

  return ui as HTMLVimeUiElement;
};
