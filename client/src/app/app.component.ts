import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { DialogService } from './services/dialog-service.service';
import { InitialResponse } from './models/web/employeeWeb';
import { Site } from './models/sites/site';
import { HttpResponse } from '@angular/common/http';
import { NotificationResponse } from './models/web/internalWeb';
import { Team } from './models/teams/team';
import { Location } from '@angular/common';
import { AppStateService } from './services/app-state.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SystemInfoResponse } from './models/web/userWeb';
import { SystemInfo } from './models/metrics/systems';
const { version: appVersion } = require('../../package.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    this.appVersion = appVersion;
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
    this.authService.setWebLabel('','', this.stateService.viewState);
    this.stateService.showMenu = false;
    this.authService.logout();
  }

  getHelp() {
    let url = '/scheduler/help/index.html';
    window.open(url, "help_win");
  }

  getInitialData(id: string) {
    this.authService.statusMessage = "Pulling Initial Data";
    this.dialogService.showSpinner();
    this.authService.systemData().subscribe({
      next: (data: SystemInfoResponse) => {
        this.dialogService.closeSpinner();
        if (data && data !== null && data.systemInfo) {
          this.authService.systemInfo = new SystemInfo(data.systemInfo);
        }
      },
      error: (err: SystemInfoResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage 
          = `Problem getting initial data: ${err.exception}`;
      }
    })
  }
}