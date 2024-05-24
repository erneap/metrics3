import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog-service.service';
import { AppStateService } from '../../services/app-state.service';
import { PasswordStrengthValidator } from '../../models/validators/password-strength-validator.directive';
import { MustMatchValidator } from '../../models/validators/must-match-validator.directive';
import { AuthenticationResponse } from '../../models/web/responses';
import { User } from '../../models/users/user';
import { SystemInfoResponse } from '../../models/web/userWeb';

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