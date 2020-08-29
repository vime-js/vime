/* eslint-disable no-param-reassign */

import { isNull } from '../../../utils/unit';
import { Disposal } from './Disposal';

/**
 * @inspiredby https://github.com/ApoorvSaxena/lozad.js/blob/master/src/lozad.js
 */

const getLazyElements = (player: HTMLVimePlayerElement) => player
  .querySelectorAll('.lazy') as NodeListOf<HTMLElement>;

const loadLazyElement = (element: HTMLElement) => {
  const name = element.nodeName.toLowerCase();

  if (name === 'picture') {
    const img = document.createElement('img');
    if (!isNull(element.getAttribute('data-alt'))) img.alt = element.getAttribute('data-alt')!;
    element.append(img);
  }

  if ((name === 'video' || name === 'audio') && !isNull(element.children)) {
    const sources = element.children;
    for (let i = 0; i <= sources.length - 1; i += 1) {
      const src = sources[i].getAttribute('data-src');
      if (!isNull(src)) (sources[i] as HTMLSourceElement).src = src!;
    }
    (element as HTMLMediaElement).load();
  }

  if (!isNull(element.getAttribute('data-poster'))) {
    (element as HTMLVideoElement).poster = element.getAttribute('data-poster')!;
  }

  if (!isNull(element.getAttribute('data-src'))) {
    (element as HTMLVideoElement).src = element.getAttribute('data-src')!;
  }

  if (!isNull(element.getAttribute('data-srcset'))) {
    (element as HTMLPictureElement).setAttribute('srcset', element.getAttribute('data-srcset')!);
  }

  element.setAttribute('data-loaded', 'true');
};

const loadAllLazyElements = (player: HTMLVimePlayerElement) => {
  getLazyElements(player).forEach((element) => { loadLazyElement(element); });
};

const onIntersection: IntersectionObserverCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0 || entry.isIntersecting) {
      const element = entry.target as HTMLElement;
      observer.unobserve(element);
      if (element.nodeName === 'VIME-PLAYER') {
        loadAllLazyElements(element as HTMLVimePlayerElement);
      } else {
        loadLazyElement(element);
      }
    }
  });
};

export const lazyLoader = (
  player: HTMLVimePlayerElement,
  options: IntersectionObserverInit = {},
) => {
  const disposal = new Disposal();

  if (typeof window !== 'undefined' && window.IntersectionObserver) {
    const observer = new IntersectionObserver(onIntersection, options);
    observer!.observe(player);
    disposal.add(() => { observer!.unobserve(player); });
    getLazyElements(player).forEach((element) => {
      observer!.observe(element);
      disposal.add(() => { observer!.unobserve(element); });
    });
  } else {
    loadAllLazyElements(player);
  }

  return () => { disposal.empty(); };
};
