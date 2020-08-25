import { Component, ViewChild } from '@angular/core';
import { VimePlayer } from '@vime/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  // Obtain a ref if you need to call any methods.
  @ViewChild('player') player!: VimePlayer;

  onPlaybackReady() {
    // ...
  }
}
