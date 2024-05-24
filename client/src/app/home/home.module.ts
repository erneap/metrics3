import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './forgot-password-reset/forgot-password-reset.component';
import { HeaderComponent } from './header/header.component';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PasswordExpireDialogComponent } from './password-expire-dialog/password-expire-dialog.component';
import { StatusbarComponent } from './statusbar/statusbar.component';
import { WaitDialogComponent } from './wait-dialog/wait-dialog.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    ForgotPasswordComponent,
    ForgotPasswordResetComponent,
    HeaderComponent,
    NavigationMenuComponent,
    NotFoundComponent,
    PasswordExpireDialogComponent,
    StatusbarComponent,
    WaitDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
