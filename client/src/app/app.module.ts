import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WaitDialogComponent } from './home/wait-dialog/wait-dialog.component';
import { MaterialModule } from './material.module';
import { AuthService } from './services/auth.service';
import { DialogService } from './services/dialog-service.service';
import { PasswordExpireDialogComponent } from './home/password-expire-dialog/password-expire-dialog.component';
import { NavigationMenuComponent } from './home/navigation-menu/navigation-menu.component';
import { NotFoundComponent } from './home/not-found/not-found.component';
import { GenericModule } from './generic/generic.module';
import { DeletionConfirmationComponent } from './generic/deletion-confirmation/deletion-confirmation.component';
import { ForgotPasswordComponent } from './home/forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './home/forgot-password-reset/forgot-password-reset.component';
import { PtoHolidayBelowDialogComponent } from './home/pto-holiday-below-dialog/pto-holiday-below-dialog.component';
import { interceptorProviders } from './services/spin-interceptor.interceptor';
import { AppStateService } from './services/app-state.service';
import { HeaderComponent } from './home/header/header.component';
import { StatusbarComponent } from './home/statusbar/statusbar.component';
import { MissionsModule } from './missions/missions.module';
import { MissionService } from './services/mission.service';
import { ReviewsModule } from './reviews/reviews.module';
import { ProfileComponent } from './home/profile/profile.component';
import { OutagesModule } from './outages/outages.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WaitDialogComponent,
    PasswordExpireDialogComponent,
    NavigationMenuComponent,
    NotFoundComponent,
    DeletionConfirmationComponent,
    ForgotPasswordComponent,
    ForgotPasswordResetComponent,
    PtoHolidayBelowDialogComponent,
    HeaderComponent,
    StatusbarComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    GenericModule,
    MissionsModule,
    ReviewsModule,
    OutagesModule
  ],
  exports: [
    DeletionConfirmationComponent
  ],
  providers: [AuthService, DialogService, interceptorProviders,
    AppStateService, MissionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
