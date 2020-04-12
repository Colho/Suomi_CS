import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { TeamComponent } from './team/team.component';
import { InfoComponent } from './info/info.component';

import { NodeService } from './node.service';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    TeamComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ NodeService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
