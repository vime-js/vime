import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { VimeModule } from '@vime/angular/dist';

import { AppComponent } from './app.component';
import { TapSidesToSeekComponent } from './tap-sides-to-seek/tap-sides-to-seek.component'

@NgModule({
  declarations: [
    AppComponent,
    TapSidesToSeekComponent,
  ],
  imports: [
    BrowserModule,
    VimeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
