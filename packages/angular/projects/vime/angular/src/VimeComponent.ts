import {
  PlayerProp,
  Dispatcher,
  findPlayer,
  usePlayerContext,
  createDispatcher,
} from '@vime/core';
import { ElementRef, Injectable } from '@angular/core';

@Injectable()
export abstract class VimeComponent {
  private playerDispatch: Dispatcher = () => {};

  private unbindPlayerContext = () => {};

  private playerCache = new Map<PlayerProp, any>();

  protected player?: HTMLVmPlayerElement;

  protected abstract ref: ElementRef;

  constructor(private readonly playerProps: PlayerProp[]) {
    playerProps.forEach((prop) => { this.playerCache.set(prop, (this as any)[prop]); });

    const props = playerProps.reduce((prev, prop) => ({
      ...prev,
      [prop]: {
        get() {
          return (this as any).playerCache.get(prop);
        },
        set: (value: any) => {
          if (this.playerCache.get(prop) !== value) {
            this.playerDispatch(prop as any, value);
            this.playerCache.set(prop, value);
          }
        },
      },
    }), {});

    Object.defineProperties(this, props);
  }

  async ngAfterViewInit() {
    if (!this.ref.nativeElement) return;
    this.player = await findPlayer(this.ref.nativeElement);
    if (!this.player) return;

    this.playerDispatch = createDispatcher(this.ref.nativeElement);

    this.unbindPlayerContext = await usePlayerContext(
      this.ref.nativeElement,
      this.playerProps,
      (prop, value) => {
        this.playerCache.set(prop as any, value);
        (this as any)[prop] = value;
      },
      this.player,
    );
  }

  ngOnDestroy() {
    this.unbindPlayerContext?.();
    this.playerCache.clear();
  }
}
