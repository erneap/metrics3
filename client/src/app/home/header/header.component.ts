import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() sidenav = new EventEmitter<any>();

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    protected appState: AppStateService,
    protected authService: AuthService,
    private router: Router
  ) {
    iconRegistry.addSvgIcon('calendar',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/icons/calendar.svg'));
  }

  viewLogin(): void {
    this.router.navigateByUrl('/login');
  }

  logout() {
    this.authService.setWebLabel('','');
    this.authService.systemInfo = undefined;
    this.appState.showMenu = false;
    this.authService.logout();
  }

  toggle() {
    this.appState.toggle();
  }

  getHelp() {
    let url = '/scheduler/help/index.html';
    window.open(url, "help_win");
  }
}
