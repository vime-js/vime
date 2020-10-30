/* eslint-disable no-param-reassign */
import { IS_CLIENT } from '../../../utils/support';
import { isNull, isNullOrUndefined } from '../../../utils/unit';

export class LazyLoader {
  private intersectionObs?: IntersectionObserver;

  private mutationObs?: MutationObserver;

  private hasLoaded = false;

  constructor(private el: HTMLElement, private onLoad?: () => void) {
    if (isNullOrUndefined(this.el)) return;

    this.intersectionObs = this.canObserveIntersection()
      ? (new IntersectionObserver(this.onIntersection.bind(this)))
      : undefined;

    this.mutationObs = this.canObserveMutations()
      ? (new MutationObserver(this.onMutation.bind(this)))
      : undefined;

    this.mutationObs?.observe(this.el, {
      childList: true,
      subtree: true,
      attributeFilter: [
        'data-src',
        'data-alt',
        'data-poster',
      ],
    });

    this.lazyLoad();
  }

  destroy() {
    this.intersectionObs?.disconnect();
    this.mutationObs?.disconnect();
  }

  private canObserveIntersection() {
    return IS_CLIENT && window.IntersectionObserver;
  }

  private canObserveMutations() {
    return IS_CLIENT && window.MutationObserver;
  }

  private lazyLoad() {
    if (this.canObserveIntersection()) {
      this.intersectionObs?.observe(this.el);
    } else {
      this.load();
    }
  }

  private onIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0 || entry.isIntersecting) this.load();
    });
  }

  private onMutation() {
    if (this.hasLoaded) this.load();
  }

  private getLazyElements() {
    return this.el.querySelectorAll('.lazy');
  }

  private load() {
    window.requestAnimationFrame(() => {
      this.getLazyElements().forEach(this.loadEl.bind(this));
    });
  }

  private loadEl(el: Element) {
    const name = el.nodeName.toLowerCase();

    if ((name === 'video' || name === 'audio') && !isNull(el.children)) {
      const sources = el.children;
      for (let i = 0; i <= sources.length - 1; i += 1) {
        const src = sources[i].getAttribute('data-src');
        if (!isNull(src)) {
          (sources[i] as HTMLSourceElement).src = src!;
          sources[i].removeAttribute('data-src');
        }
      }
    }

    if (!isNull(el.getAttribute('data-poster'))) {
      (el as HTMLVideoElement).poster = el.getAttribute('data-poster')!;
      el.removeAttribute('data-poster');
    }

    if (!isNull(el.getAttribute('data-src'))) {
      (el as HTMLMediaElement).src = el.getAttribute('data-src')!;
      el.removeAttribute('data-src');
    }

    this.intersectionObs?.unobserve(el);
    this.hasLoaded = true;
    this.onLoad?.();
  }
}
