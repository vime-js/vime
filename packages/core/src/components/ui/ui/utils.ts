import { getElement } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { isNull } from '../../../utils/unit';

export const findUIRoot = (ref: any): HTMLVimeUiElement | null => {
  let ui: any = getElement(ref);

  while (!isNull(ui) && !(/^VIME-UI$/.test(ui.nodeName))) {
    ui = ui.parentElement as HTMLStencilElement;
  }

  return ui;
};
