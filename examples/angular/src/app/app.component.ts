import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-example';

  onPlaying(event: CustomEvent<boolean>) {
    console.log('playing:', event.detail);
  }
}
