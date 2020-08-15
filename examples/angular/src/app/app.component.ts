import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-example';
  
  currentTime = 0;

  onTimeUpdate(event: CustomEvent<number>) {
    this.currentTime = event.detail;
  }

  onSeekBackward() {
    this.currentTime -= 5;
  }

  onSeekForward() {
    this.currentTime += 5;
  }
}
