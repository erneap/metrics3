import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemInfo } from 'src/app/models/metrics/systems';
import { Site } from 'src/app/models/sites/site';
import { Team } from 'src/app/models/teams/team';
import { User } from 'src/app/models/users/user';
import { MustMatchValidator } from 'src/app/models/validators/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/validators/password-strength-validator.directive';
import { AuthenticationResponse, InitialResponse } from 'src/app/models/web/employeeWeb';
import { NotificationResponse } from 'src/app/models/web/internalWeb';
import { SystemInfoResponse } from 'src/app/models/web/userWeb';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-forgot-password-reset',
  templateUrl: './forgot-password-reset.component.html',
  styleUrls: ['./forgot-password-reset.component.scss']
})
export class ForgotPasswordResetComponent {
  changeForm: FormGroup;
  errormsg: string = "";

  constructor(
    protected authService: AuthService,
    protected dialogService: DialogService,
    protected stateService: AppStateService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.changeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [new PasswordStrengthValidator(), Validators.required]],
      password2: ['', [new MustMatchValidator(), Validators.required]],
      token: ['', [Validators.required]],
    })
  }

  login() {
    if (this.changeForm.valid) {
      this.authService.statusMessage = "Resetting Password";
      this.dialogService.showSpinner();
      this.authService.sendPasswordReset(
        this.changeForm.value.email,
        this.changeForm.value.password,
        this.changeForm.value.token
      ).subscribe({
        next: (data: AuthenticationResponse) => {
          this.errormsg = '';
          this.dialogService.closeSpinner();
          let id = '';
          if (data.user) {
            const user = new User(data.user);
            id = user.id;
            this.authService.setUser(user);
          }
          if (data.token) {
            this.authService.setToken(data.token);
          }
          if (!data.exception || data.exception === '') {
            this.authService.isAuthenticated = true;
            this.authService.startTokenRenewal();
            this.authService.statusMessage = "User Login Complete";
            this.getInitialData(id);
          } else {
            this.errormsg = data.exception;
            this.authService.isAuthenticated = false;
          }
        },
        error: (err: AuthenticationResponse) => {
          this.dialogService.closeSpinner();
          this.errormsg = err.exception;
        }
      })
    }
  }

  getInitialData(id: string) {
    this.authService.statusMessage = "Pulling Initial Data";
    this.dialogService.showSpinner();
    this.authService.systemData().subscribe({
      next: (data: SystemInfoResponse) => {
        this.dialogService.closeSpinner();
        this.authService.systemInfo = undefined;
        if (data && data !== null && data.systemInfo) {
          this.authService.systemInfo = new SystemInfo(data.systemInfo);
        }
      },
      error: (err: InitialResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = `Problem getting initial data: ${err.exception}`;
      }
    })
  }
  
  getPasswordError(): string {
    let answer: string = ''
    if (this.changeForm.get('password')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.changeForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't meet minimum requirements";
    }
    return answer;
  }

  getVerifyError(): string {
    let answer: string = ''
    if (this.changeForm.get('password2')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.changeForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't match";
    }
    return answer;
  }
}
