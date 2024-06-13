import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './home/not-found/not-found.component';
import { ForgotPasswordComponent } from './home/forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './home/forgot-password-reset/forgot-password-reset.component';
import { MissionsComponent } from './missions/missions.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ProfileComponent } from './home/profile/profile.component';
import { OutagesComponent } from './outages/outages.component';
import { AdminComponent } from './admin/admin.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'missions', component: MissionsComponent },
  { path: 'outages', component: OutagesComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'review', component: ReviewsComponent },
  { path: 'reset/start', component: ForgotPasswordComponent },
  { path: 'reset/finish', component: ForgotPasswordResetComponent },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
