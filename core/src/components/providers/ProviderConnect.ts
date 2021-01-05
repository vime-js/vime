import { getElement, writeTask } from '@stencil/core';
import { Disposal } from '../../utils/Disposal';
import { listen } from '../../utils/dom';
import { createStencilHook } from '../../utils/stencil';
import { StateChange } from '../core/player/PlayerDispatcher';
import { PlayerProps } from '../core/player/PlayerProps';
import { AdapterHost } from './MediaProvider';
import { Provider } from './Provider';
import { PROVIDER_CHANGE_EVENT } from './ProviderDispatcher';
import { ProviderWritableProps, isProviderWritableProp } from './ProviderProps';

export const PROVIDER_CACHE_KEY = Symbol('vmProviderCache');
export const PROVIDER_CONNECT_EVENT = 'vmMediaProviderConnect';
export const PROVIDER_DISCONNECT_EVENT = 'vmMediaProviderDisconnect';

export type ProviderCache = Map<keyof ProviderWritableProps, any>;

export type ProviderConnectEventDetail = AdapterHost;

export interface ProviderHost extends ProviderWritableProps {
  [PROVIDER_CACHE_KEY]?: ProviderCache;
  ready: boolean;
  currentProvider?: Provider;
  logger?: PlayerProps['logger'];
  provider?: AdapterHost;
  onProviderDisconnect?: () => void;
}

function buildProviderConnectEvent(name: string, host?: AdapterHost) {
  return new CustomEvent<ProviderConnectEventDetail>(name, {
    bubbles: true,
    composed: true,
    detail: host,
  });
}

export function withProviderHost(connector: ProviderHost) {
  const el = getElement(connector);
  const disposal = new Disposal();

  const cache: ProviderCache = new Map();
  connector[PROVIDER_CACHE_KEY] = cache;

  function initCache() {
    (Object.keys(connector) as (keyof ProviderWritableProps)[]).forEach(
      (prop) => {
        cache.set(prop, connector[prop]);
      },
    );
  }

  function onDisconnect() {
    writeTask(async () => {
      connector.ready = false;
      connector.provider = undefined;
      cache.clear();
      connector.onProviderDisconnect?.();
      el.dispatchEvent(buildProviderConnectEvent(PROVIDER_DISCONNECT_EVENT));
    });
  }

  function onConnect(event: CustomEvent<ProviderConnectEventDetail>) {
    event.stopImmediatePropagation();
    initCache();

    const hostRef = event.detail;
    const host = getElement(event.detail) as AdapterHost;
    if (connector.provider === host) return;

    const name = host?.nodeName.toLowerCase().replace('vm-', '');

    writeTask(async () => {
      connector.provider = host;
      connector.currentProvider = Object.values(Provider).find(
        (provider) => name === provider,
      );
      createStencilHook(hostRef, undefined, () => onDisconnect());
    });
  }

  function onChange(event: CustomEvent<StateChange<ProviderWritableProps>>) {
    event.stopImmediatePropagation();
    const { by, prop, value } = event.detail;

    if (!isProviderWritableProp(prop)) {
      connector.logger?.warn(
        `${by.nodeName} tried to change \`${prop}\` but it is readonly.`,
      );
      return;
    }

    writeTask(() => {
      cache.set(prop, value);
      (connector as any)[prop] = value;
    });
  }

  createStencilHook(
    connector,
    () => {
      disposal.add(listen(el, PROVIDER_CONNECT_EVENT, onConnect));
      disposal.add(listen(el, PROVIDER_CHANGE_EVENT, onChange));
    },
    () => {
      disposal.empty();
      cache.clear();
    },
  );
}

export function withProviderConnect(ref: any) {
  const connectEvent = buildProviderConnectEvent(PROVIDER_CONNECT_EVENT, ref);

  createStencilHook(ref, () => {
    getElement(ref).dispatchEvent(connectEvent);
  });
}
