import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from './services/auth.service';
import { AppStateService } from './services/app-state.service';
import { DialogService } from './services/dialog-service.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SystemInfoResponse } from './models/web/userWeb';
import * as jsonData from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  isMobile = false;
  initialUrl: string = '';
  appVersion: string;
  width: number;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    protected authService: AuthService,
    protected stateService: AppStateService,
    protected dialogService: DialogService,
    private router: Router,
    private location: Location
  ) {
    this.appVersion = jsonData.version;
    if (this.location.path() && this.location.path() !== '') {
      this.initialUrl = this.location.path();
    } else {
      this.initialUrl = "/home";
    }
    iconRegistry.addSvgIcon('calendar',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/icons/calendar.svg'));
    const user = this.authService.getUser();
    if (this.authService.isTokenExpired() || !user) {
      this.router.navigate(['/home']);
    } else {
      this.getInitialData();
    }
    this.width = this.stateService.viewWidth;
    if (!this.authService.isAuthenticated) {
      this.stateService.showMenu = false;
    } else {
      this.stateService.showMenu = !this.stateService.isMobile();
      if (this.stateService.showMenu) {
        this.width = this.width - 250;
      }
      this.isMobile = this.stateService.isMobile() || this.stateService.isTablet();
    }
  }

  logout() {
    this.authService.setWebLabel(this.stateService.viewState);
    this.stateService.showMenu = false;
    this.authService.logout();
  }

  getHelp() {
    let url = '/scheduler/help/index.html';
    window.open(url, "help_win");
  }

  getInitialData() {
    this.authService.statusMessage = "Pulling Initial Data";
    this.dialogService.showSpinner();
    this.authService.systemData().subscribe({
      next: (data: SystemInfoResponse) => {
        this.dialogService.closeSpinner();
        if (data && data !== null && data.systemInfo) {
          this.authService.systemInfo = data.systemInfo;
        }
      },
      error: (err: SystemInfoResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    })
  }
}
