import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VimeModule } from '@vime/angular/dist';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    VimeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
