import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HomeModule } from './home/home.module';
import { AuthService } from './services/auth.service';
import { DialogService } from './services/dialog-service.service';
import { interceptorProviders } from './services/spin-interceptor.interceptor';
import { AppStateService } from './services/app-state.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HomeModule
  ],
  providers: [AuthService, DialogService, interceptorProviders,
    AppStateService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
