import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/users/user';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PasswordExpireDialogComponent } from './password-expire-dialog/password-expire-dialog.component';
import { WaitDialogComponent } from './wait-dialog/wait-dialog.component';
import { DialogService } from '../services/dialog-service.service';
import { AppStateService } from '../services/app-state.service';
import { AuthenticationResponse } from '../models/web/responses';
import { SystemInfo } from '../models/systems';
import { SystemInfoResponse } from '../models/web/userWeb';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginForm: FormGroup;
  loginError: string = '';
  matDialogRef?: MatDialogRef<WaitDialogComponent> = undefined
  ipAddress: string = "";

  constructor(
    public authService: AuthService,
    protected stateService: AppStateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private dialogService: DialogService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
      ]],
    });
    const user = this.authService.getUser();
    if (user) {
      this.authService.isAuthenticated = true;
      this.getInitialData()
    }
  }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
      ]],
    });
  }

  login() {
    this.authService.clearToken();
    let data = { emailAddress: this.loginForm.value.email,
      password: this.loginForm.value.password };
    this.dialogService.showSpinner();
    this.authService.loginError = "";
    
    this.authService.statusMessage = "User Login in Progress";
    this.authService.login(data.emailAddress, data.password).subscribe({
      next: (data: AuthenticationResponse) => {
        this.dialogService.closeSpinner();
        this.authService.isAuthenticated = true;
        let id = '';
        if (data.user) {
          const user = new User(data.user);
          id = user.id;
          this.authService.setUser(user);
          const expiresIn = Math.floor((user.passwordExpires.getTime() - (new Date).getTime())/(24 * 3600000));
          if (expiresIn <= 10) {
            const dialogRef = this.dialog.open(PasswordExpireDialogComponent, {
              width: '250px',
              data: { days: expiresIn },
            });
          }
        }
        if (data.token) {
          this.authService.setToken(data.token);
        }
        if (!data.exception || data.exception === '') {
          this.authService.isAuthenticated = true;
          this.stateService.showMenu = this.stateService.isDesktop();
          this.authService.startTokenRenewal();
          this.authService.statusMessage = "User Login Complete";
          this.getInitialData();
        } else {
          this.loginError = data.exception;
          this.authService.isAuthenticated = false;
        }
      },
      error: (err: AuthenticationResponse) => {
        console.log(err);
        this.dialogService.closeSpinner();
        this.loginError = err.exception
        this.authService.statusMessage = err.exception;
        this.authService.isAuthenticated = false;
      }
    });
  }

  getInitialData() {
    this.authService.statusMessage = "Pulling Initial Data";
    this.dialogService.showSpinner();
    this.authService.systemData().subscribe({
      next: (data: SystemInfoResponse) => {
        this.dialogService.closeSpinner();
        this.authService.systemInfo = undefined;
        if (data && data !== null && data.systemInfo) {
          this.authService.systemInfo = data.systemInfo;
        }
      },
      error: (err: SystemInfoResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = `Problem getting initial data: ${err.exception}`;
      }
    })
  }
}

