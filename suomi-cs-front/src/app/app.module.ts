import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchComponent } from './match/match.component';
import { TeamComponent } from './team/team.component';
import { InfoComponent } from './info/info.component';

import { NodeService } from './services/node.service';
import { LoaderComponent } from './loader/loader.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TeamContainerComponent } from './team-container/team-container.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    TeamComponent,
    InfoComponent,
    LoaderComponent,
    TeamContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [
    NodeService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
