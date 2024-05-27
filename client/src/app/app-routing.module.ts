import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './home/not-found/not-found.component';
import { ForgotPasswordComponent } from './home/forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './home/forgot-password-reset/forgot-password-reset.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'reset/start', component: ForgotPasswordComponent },
  { path: 'reset/finish', component: ForgotPasswordResetComponent },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
