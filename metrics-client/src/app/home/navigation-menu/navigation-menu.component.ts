import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/users/user';
import { AuthService } from '../../services/auth.service';
import { AppStateService } from '../../services/app-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})
export class NavigationMenuComponent {
  @Input() user: User | undefined;
  @Output() sidenav = new EventEmitter<any>();
  section: string = 'employee';
  constructor(
    public authService: AuthService,
    protected appState: AppStateService,
    private router: Router
  ) {
    
  }

  isInGroup(role: string): boolean {
    return this.authService.hasRole(role);
  }

  goToLink(url: string) {
    this.router.navigateByUrl(url);
    if (!this.appState.isDesktop()) {
      this.appState.showMenu = !this.appState.showMenu;
      this.sidenav.emit();
    }
  }

  toggle() {
    this.appState.showMenu = !this.appState.showMenu;
    this.sidenav.emit();
  }
}
