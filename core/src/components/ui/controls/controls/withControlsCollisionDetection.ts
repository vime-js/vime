/* eslint-disable func-names */
import { getElement, writeTask } from '@stencil/core';
import { isColliding } from '../../../../utils/dom';
import { createStencilHook, wrapStencilHook } from '../../../../utils/stencil';
import { isNull } from '../../../../utils/unit';

const watch = new Set<HTMLElement>();
const controls = new Set<HTMLElement>();

// watchedEl -> (controlsEl -> controlsHeight) saved on collision. Basically keeps track of
// every collision with all controls for each watched element.
const collisions = new Map<HTMLElement, Map<HTMLElement, number>>();

function update() {
  writeTask(() => {
    controls.forEach((controlsEl) => {
      const controlsHeight = parseFloat(
        window.getComputedStyle(controlsEl!).height,
      );
      watch.forEach((watchedEl) => {
        const watchedElCollisions = collisions.get(watchedEl)!;
        const hasCollided = isColliding(watchedEl, controlsEl);
        const willCollide =
          isColliding(watchedEl, controlsEl, 0, controlsHeight) ||
          isColliding(watchedEl, controlsEl, 0, -controlsHeight);
        watchedElCollisions.set(
          controlsEl,
          hasCollided || willCollide ? controlsHeight : 0,
        );
      });
    });

    // Update after assessing all collisions so there are no glitchy movements.
    watch.forEach((watchedEl) => {
      const watchedElCollisions = collisions.get(watchedEl)!;
      watchedEl.style.setProperty(
        '--vm-controls-height',
        `${Math.max(0, Math.max(...watchedElCollisions.values()))}px`,
      );
    });
  });
}

export function registerControlsForCollisionDetection(component: any) {
  const el = getElement(component);

  function getInnerEl() {
    return el.shadowRoot!.querySelector('.controls') as HTMLElement;
  }

  createStencilHook(
    component,
    () => {
      const innerEl = getInnerEl();
      if (!isNull(innerEl)) {
        controls.add(innerEl);
        update();
      }
    },
    () => {
      controls.delete(getInnerEl());
      update();
    },
  );

  wrapStencilHook(component, 'componentDidLoad', () => {
    controls.add(getInnerEl());
    update();
  });

  wrapStencilHook(component, 'componentDidRender', update);
}

export function withControlsCollisionDetection(component: any) {
  const el = getElement(component);
  createStencilHook(
    component,
    () => {
      watch.add(el);
      collisions.set(el, new Map());
      update();
    },
    () => {
      watch.delete(el);
      collisions.delete(el);
    },
  );
}
