import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser, User } from 'src/app/models/users/user';
import { MustMatchValidator } from 'src/app/models/validators/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/validators/password-strength-validator.directive';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent {
  private _user: User = new User();
  @Input()
  public set user(u: IUser) {
    this._user = new User(u);
    this.setUser();
  }
  get user(): User {
    return this._user;
  }
  @Input() width: number = 800;
  @Output() changed = new EventEmitter<string>();
  profileForm: FormGroup;

  constructor(
    protected authService: AuthService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first: ['', [Validators.required]],
      middle: '',
      last: ['', [Validators.required]],
      geoint: false,
      xint: false,
      mist: false,
      admin: false,
      password: ['', [new PasswordStrengthValidator()]],
      password2: ['', [new MustMatchValidator()]],
    });
  }

  setUser() {
    this.profileForm.controls['email'].setValue(this.user.emailAddress);
    this.profileForm.controls['first'].setValue(this.user.firstName);
    this.profileForm.controls['middle'].setValue(this.user.middleName);
    this.profileForm.controls['last'].setValue(this.user.lastName);
    this.profileForm.controls['geoint'].setValue(
      this.user.isInGroup('metrics', 'geoint'));
    this.profileForm.controls['xint'].setValue(
      this.user.isInGroup('metrics', 'xint'));
    this.profileForm.controls['mist'].setValue(
      this.user.isInGroup('metrics', 'mist'));
    this.profileForm.controls['admin'].setValue(
      this.user.isInGroup('metrics', 'admin'));
    this.profileForm.controls['password'].setValue('');
    this.profileForm.controls['password2'].setValue('');
  }

  getPasswordError(): string {
    let answer: string = ''
    if (this.profileForm.get('password')?.hasError('required')) {
      answer = "Required";
    }
    if (this.profileForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Minimum(s)";
    }
    return answer;
  }

  getVerifyError(): string {
    let answer: string = ''
    if (this.profileForm.get('password2')?.hasError('required')) {
      answer = "Required";
    }
    if (this.profileForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Doesn't match";
    }
    return answer;
  }

  onAdd() {
    this.changed.emit('refresh')
  }

  onUpdate(field: string) {
    if (this.user.id !== 'new' && this.user.id !== '') {
      let change = field;
      let value = this.profileForm.controls[field].value;
      switch (field.toLowerCase()) {
        case "geoint":
        case "xint":
        case "mist":
        case "admin":
      }
      this.changed.emit('update');
    }
  }

  onDelete() {

  }

  onClear() {
    this.changed.emit('clear');
  }
}
