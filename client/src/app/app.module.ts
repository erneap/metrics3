import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { AdminModule } from './admin/admin.module';
import { UsedEmailValidator } from './models/validators/used-email-validator.directive';
import { FormsModule } from '@angular/forms';
import { AdminService } from './services/admin.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportsModule } from './reports/reports.module';
import { ReportArchiveModule } from './report-archive/report-archive.module';

@NgModule({ declarations: [
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
        ProfileComponent,
        UsedEmailValidator
    ],
    exports: [
        DeletionConfirmationComponent
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        GenericModule,
        MissionsModule,
        ReviewsModule,
        OutagesModule,
        AdminModule,
        ReportsModule ], 
    providers: [AuthService, DialogService, interceptorProviders,
        AppStateService, MissionService, AdminService, ReportArchiveModule,
        provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
