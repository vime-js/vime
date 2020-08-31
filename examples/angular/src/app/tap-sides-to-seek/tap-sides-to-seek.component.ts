import { Component, ElementRef } from '@angular/core';
import { VimeComponent } from '@vime/angular/';

@Component({
  selector: 'tap-sides-to-seek',
  templateUrl: './tap-sides-to-seek.component.html',
})
export class TapSidesToSeekComponent extends VimeComponent {
  currentTime = 0;

  duration = -1;

  /**
   * When we extend the `VimeComponent` class a few things are happening under the hood.
   *
   * 1. The super constructor overwrites all player properties with fresh getters/setters. Not all
   * properties contain setters (readonly), so it's best to refer to the documentation.
   * 2. The component binds itself to the player context so that player properties are updated as
   * they change.
   * 3. The component will dispatch any updates to the player if a writable player prop is changed.
   * 4. When the component is destroyed, it will automatically unbind itself from the player.
   *
   * IMPORTANT: The `ElementRef` is required as the `VimeComponent` class uses it to dispatch
   * custom events to the player. Angular automatically injects this value.
   *
   * @see https://vimejs.com/components/core/player/api
   */
  constructor(protected ref: ElementRef) {
    // Pass in the properties you'd like to bind to this component.
    super([
      'currentTime',
      'duration',
    ]);

    // There is a player ref if you need to call any methods.
    // this.player
  }

  onSeekBackward() {
    if (this.currentTime < 5) return;
    this.currentTime -= 5;
  }

  onSeekForward() {
    if (this.currentTime > (this.duration - 5)) return;
    this.currentTime += 5;
  }
}
