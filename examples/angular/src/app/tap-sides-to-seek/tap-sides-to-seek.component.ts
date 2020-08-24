import { Component, ElementRef } from '@angular/core';
import { PlayerProp, usePlayerContext, PlayerDispatcher, createPlayerDispatcher } from '@vime/core';

@Component({
  selector: 'tap-sides-to-seek',
  templateUrl: './tap-sides-to-seek.component.html',
})
export class TapSidesToSeekComponent {
  dispatch!: PlayerDispatcher;

  currentTime = 0;

  duration = -1;

  /**
   * We need a reference to a DOM element so the Vime hooks work as they rely on dispatching 
   * custom DOM events.
   */
  constructor(private ref: ElementRef) {}

  ngAfterViewInit() {
    /**
     * Here we are creating a dispatcher to send updates to the player.
     */
    this.dispatch = createPlayerDispatcher(this.ref.nativeElement);
    
    /**
     * Here we are requesting to receive updates from the player, as the requested propties change 
     * it will be updated here.
     */
    usePlayerContext(
      this.ref.nativeElement,
      [PlayerProp.currentTime, PlayerProp.duration],
      (prop, value) => { this[prop] = value; }
    );
  }

  onSeekBackward() {
    if (this.currentTime < 5) return;
    // We are dispatching an update to the player to change the `currentTime` property.
    this.dispatch(PlayerProp.currentTime, this.currentTime - 5);
  }

  onSeekForward() {
    if (this.currentTime > (this.duration - 5)) return;
    this.dispatch(PlayerProp.currentTime, this.currentTime + 5);
  }
}
