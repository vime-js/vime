import { ComponentInterface, getElement } from '@stencil/core';

import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { createStencilHook } from '../../../utils/stencil';
import { isInstanceOf, isUndefined } from '../../../utils/unit';
import { findPlayer } from './findPlayer';
import { MediaPlayer } from './MediaPlayer';

export const PLAYER_KEY = Symbol('vmPlayerKey');
export const COMPONENT_NAME_KEY = Symbol('vmNameKey');
export const REGISTRY_KEY = Symbol('vmRegistryKey');
export const REGISTRATION_KEY = Symbol('vmRegistrationKey');
export const REGISTER_COMPONENT_EVENT = 'vmComponentRegister';
export const DEREGISTER_COMPONENT_EVENT = 'vmComponentDeregister';
export const COMPONENT_REGISTERED_EVENT = 'vmComponentRegistered';
export const COMPONENT_DEREGISTERED_EVENT = 'vmComponentDeregistered';

export type ComponentRegistry = Map<symbol, ComponentRegistrant<HTMLElement>>;

export type ComponentRegistrant<T extends HTMLElement = HTMLElement> = T & {
  [COMPONENT_NAME_KEY]: string;
  [PLAYER_KEY]?: HTMLVmPlayerElement;
  [REGISTRY_KEY]?: ComponentRegistry;
  [REGISTRATION_KEY]: symbol;
};

export type ComponentRegistrationEvent = CustomEvent<ComponentRegistrant>;

const getRegistrant = (ref: unknown): ComponentRegistrant =>
  isInstanceOf(ref, HTMLElement)
    ? (ref as ComponentRegistrant)
    : ((getElement(ref) as unknown) as ComponentRegistrant);

/**
 * Handles registering/deregistering the given `component` in the player registry. All registries
 * are bound per player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 */
export function withComponentRegistry(
  ref: ComponentInterface | HTMLElement,
  name?: string,
): void {
  const registryId = Symbol('vmRegistryId');
  const registrant = getRegistrant(ref);

  registrant[COMPONENT_NAME_KEY] = name ?? registrant.nodeName.toLowerCase();
  registrant[REGISTRATION_KEY] = registryId;

  const buildEvent = (eventName: string): ComponentRegistrationEvent =>
    new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: registrant,
    });

  const registerEvent = buildEvent(REGISTER_COMPONENT_EVENT);

  createStencilHook(ref, () => {
    registrant.dispatchEvent(registerEvent);
  });
}

export function withComponentRegistrar(player: MediaPlayer): void {
  const el = getElement(player) as HTMLVmPlayerElement;
  const registry: ComponentRegistry = new Map();
  const disposal = new Disposal();

  // TODO properly type this later.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (el as any)[REGISTRY_KEY] = registry;

  function onDeregister(registrant: ComponentRegistrant) {
    delete registrant[PLAYER_KEY];
    delete registrant[REGISTRY_KEY];
    registry.delete(registrant[REGISTRATION_KEY]);
    el.dispatchEvent(
      new CustomEvent(COMPONENT_DEREGISTERED_EVENT, { detail: registrant }),
    );
  }

  function onRegister(e: ComponentRegistrationEvent) {
    const ref = e.detail;
    const registrant = getRegistrant(ref);
    registrant[PLAYER_KEY] = el;
    registrant[REGISTRY_KEY] = registry;
    registry.set(registrant[REGISTRATION_KEY], registrant);
    el.dispatchEvent(
      new CustomEvent(COMPONENT_REGISTERED_EVENT, { detail: registrant }),
    );
    createStencilHook(ref, undefined, () => onDeregister(registrant));
  }

  createStencilHook(
    player,
    () => {
      disposal.add(listen(el, REGISTER_COMPONENT_EVENT, onRegister));
    },
    () => {
      registry.clear();
      disposal.empty();
      delete ((player as unknown) as ComponentRegistrant)[REGISTRY_KEY];
    },
  );
}

/**
 * Checks whether any component with the given `name` exists in the registry. All registries
 * are bound per player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 * @param name - The name of the component to search for.
 */
export function isComponentRegistered(
  ref: ComponentInterface | HTMLElement,
  name: string,
): boolean {
  const registrant = getRegistrant(ref);
  const registry = registrant[REGISTRY_KEY];
  return Array.from(registry?.values() ?? []).some(
    r => r[COMPONENT_NAME_KEY] === name,
  );
}

export type ComponentRegistrationChangeCallback<
  T extends HTMLElement = HTMLElement
> = (registrant: ComponentRegistrant<T>[]) => void;

/**
 * Returns the player for the given `ref`. This will only work after the component has been
 * registered, prefer using `findPlayer`.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 */
export function getPlayerFromRegistry(
  ref: unknown,
): HTMLVmPlayerElement | undefined {
  const registrant = getRegistrant(ref);
  return registrant[PLAYER_KEY];
}

/**
 * Returns a collection of components from the registry for the given `ref`. All registries
 * are bound per player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 * @param name - The name of the components to search for in the registry.
 */
export function getComponentFromRegistry<T extends keyof HTMLElementTagNameMap>(
  ref: unknown,
  name: T,
): ComponentRegistrant<HTMLElementTagNameMap[T]>[] {
  const registrant = getRegistrant(ref);
  return Array.from(registrant[REGISTRY_KEY]?.values() ?? []).filter(
    r => r[COMPONENT_NAME_KEY] === name,
  ) as ComponentRegistrant<HTMLElementTagNameMap[T]>[];
}

/**
 * Watches the current registry on the given `ref` for changes. All registries are bound per
 * player subtree.
 *
 * @param ref - A Stencil component instance or HTMLElement.
 * @param name - The name of the component to watch for.
 * @param onChange - A callback that is called when a component is registered/deregistered.
 */
export async function watchComponentRegistry<
  T extends keyof HTMLElementTagNameMap
>(
  ref: ComponentInterface | HTMLElement,
  name: T,
  onChange?: ComponentRegistrationChangeCallback<HTMLElementTagNameMap[T]>,
): Promise<() => void> {
  const player = await findPlayer(ref);
  const disposal = new Disposal();
  const registry = getRegistrant(ref)[REGISTRY_KEY];

  function listener(e: ComponentRegistrationEvent) {
    if (e.detail[COMPONENT_NAME_KEY] === name)
      onChange?.(getComponentFromRegistry(player, name));
  }

  // Hydrate.
  Array.from(registry?.values() ?? []).forEach(reg =>
    listener(new CustomEvent('', { detail: reg })),
  );

  if (!isUndefined(player)) {
    disposal.add(listen(player, COMPONENT_REGISTERED_EVENT, listener));
    disposal.add(listen(player, COMPONENT_DEREGISTERED_EVENT, listener));
  }

  createStencilHook(
    ref,
    () => {
      // no-op
    },
    () => {
      disposal.empty();
    },
  );

  return () => {
    disposal.empty();
  };
}
