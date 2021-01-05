import { IS_CLIENT } from '../../../utils/support';
import { isNullOrUndefined } from '../../../utils/unit';

export class LazyLoader {
  private intersectionObs?: IntersectionObserver;

  private mutationObs?: MutationObserver;

  private hasLoaded = false;

  constructor(
    private el: HTMLElement,
    private attributes: string[],
    private onLoad?: (el: HTMLElement) => void,
  ) {
    if (isNullOrUndefined(this.el)) return;

    this.intersectionObs = this.canObserveIntersection()
      ? new IntersectionObserver(this.onIntersection.bind(this))
      : undefined;

    this.mutationObs = this.canObserveMutations()
      ? new MutationObserver(this.onMutation.bind(this))
      : undefined;

    this.mutationObs?.observe(this.el, {
      childList: true,
      subtree: true,
      attributeFilter: this.attributes,
    });

    this.lazyLoad();
  }

  didLoad() {
    return this.hasLoaded;
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
      if (entry.intersectionRatio > 0 || entry.isIntersecting) {
        this.load();
        this.intersectionObs!.unobserve(entry.target);
      }
    });
  }

  onMutation() {
    if (this.hasLoaded) this.load();
  }

  private getLazyElements() {
    const root = !isNullOrUndefined(this.el.shadowRoot)
      ? this.el.shadowRoot
      : this.el;
    return root!.querySelectorAll<HTMLElement>('.lazy');
  }

  private load() {
    window.requestAnimationFrame(() => {
      this.getLazyElements().forEach(this.loadEl.bind(this));
    });
  }

  private loadEl(el: HTMLElement) {
    this.intersectionObs?.unobserve(el);
    this.hasLoaded = true;
    this.onLoad?.(el);
  }
}
