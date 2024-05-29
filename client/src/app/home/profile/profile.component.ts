import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/users/user';
import { MustMatchValidator } from 'src/app/models/validators/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/validators/password-strength-validator.directive';
import { AuthenticationResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profileForm: FormGroup;
  formError: string = '';

  constructor(
    protected authService: AuthService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    const user = this.authService.getUser();
    this.profileForm = fb.group({
      email: [user?.emailAddress, [Validators.required, Validators.email]],
      first: [user?.firstName, [Validators.required]],
      middle: user?.middleName,
      last: [user?.lastName, [Validators.required]],
      password: ['', [new PasswordStrengthValidator()]],
      password2: ['', [new MustMatchValidator()]],
    });
  }

  showChange(): boolean {
    const passwd = this.profileForm.value.password;
    const passwd2 = this.profileForm.value.password2;
    return (passwd !== '' && passwd2 !== '' 
      && this.profileForm.controls['password'].valid 
      && this.profileForm.controls['password2'].valid);
  }

  getPasswordError(): string {
    let answer: string = ''
    if (this.profileForm.get('password')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.profileForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't meet minimum requirements";
    }
    return answer;
  }

  getVerifyError(): string {
    let answer: string = ''
    if (this.profileForm.get('password2')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.profileForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't match";
    }
    return answer;
  }

  setPassword() {
    if (this.profileForm.valid) {
      const user = this.authService.getUser();
      const passwd = this.profileForm.value.password;
      if (user) {
        this.dialogService.showSpinner();
        this.authService.changeUser(user.id, 'password', passwd).subscribe({
          next: (data: AuthenticationResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null && data.user) {
              this.authService.setUser(new User(data.user));
            }
          },
          error: (err: AuthenticationResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    }
  }

  updateUserField(field: string) {
    const user = this.authService.getUser();
    const value = this.profileForm.controls[field].value;
    if (user) {
      this.dialogService.showSpinner();
      this.authService.changeUser(user.id, field, value).subscribe({
        next: (data: AuthenticationResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.user) {
            this.authService.setUser(new User(data.user));
          }
        },
        error: (err: AuthenticationResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }
}
