import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import * as jsonData from '../../../../package.json';

@Component({
  selector: 'app-statusbar',
  templateUrl: './statusbar.component.html',
  styleUrls: ['./statusbar.component.scss']
})
export class StatusbarComponent {
  appVersion: string = "";

  constructor(
    protected authService: AuthService 
  ) {
    this.appVersion = jsonData.version;
  }

  goToMetrics() {
    window.location.href = '/scheduler';
  }
}