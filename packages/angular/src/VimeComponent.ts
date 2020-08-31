import {
  PlayerProp,
  Dispatcher,
  findRootPlayer,
  usePlayerContext,
  createDispatcher,
} from '@vime/core';
import { ElementRef } from '@angular/core';

export abstract class VimeComponent {
  private playerDispatch: Dispatcher = () => {};

  private unbindPlayerContext = () => {};

  private playerCache = new Map<PlayerProp, any>();

  protected player!: HTMLVimePlayerElement;

  protected abstract ref: ElementRef;

  constructor(private readonly playerProps: PlayerProp[]) {
    playerProps.forEach((prop) => { this.playerCache.set(prop, this[prop]); });

    const props = playerProps.reduce((prev, prop) => ({
      ...prev,
      [prop]: {
        get() {
          return this.playerCache.get(prop);
        },
        set: (value) => {
          if (this.playerCache.get(prop) !== value) this.playerDispatch(prop as any, value);
          this.playerCache.set(prop, value);
        },
      },
    }), {});

    Object.defineProperties(this, props);
  }

  ngAfterViewInit() {
    this.player = findRootPlayer(this.ref.nativeElement);

    this.playerDispatch = createDispatcher(this.ref.nativeElement);

    this.unbindPlayerContext = usePlayerContext(
      this.ref.nativeElement,
      this.playerProps,
      (prop, value) => {
        this.playerCache.set(prop as any, value);
        (this as any)[prop] = value;
      },
    );
  }

  ngOnDestroy() {
    this.unbindPlayerContext();
    this.playerCache.clear();
  }
}
