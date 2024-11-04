import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { IUser, User } from 'src/app/models/users/user';
import { MustMatchValidator } from 'src/app/models/validators/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/validators/password-strength-validator.directive';
import { UsedEmailValidator } from 'src/app/models/validators/used-email-validator.directive';
import { AuthenticationResponse, EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { UserResponse, UsersResponse } from 'src/app/models/web/userWeb';
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
  @Output() changed = new EventEmitter<User>();
  profileForm: FormGroup;
  passwordError: boolean = false;
  verifyError: boolean = false;

  constructor(
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      id: '',
      email: ['', [Validators.required, Validators.email, 
        new UsedEmailValidator(this.authService)]],
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
    this.profileForm.controls['id'].setValue(this.user.id);
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
    this.passwordError = false
    let answer: string = ''
    if (this.profileForm.get('password')?.hasError('required')) {
      answer = "Required";
      this.passwordError = true;
    }
    if (this.profileForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Minimum(s)";
      this.passwordError = true;
    }
    return answer;
  }

  getVerifyError(): string {
    this.verifyError = false;
    let answer: string = ''
    if (this.profileForm.get('password2')?.hasError('required')) {
      answer = "Required";
      this.verifyError= true;
    }
    if (this.profileForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Doesn't match";
      this.verifyError = true;
    }
    return answer;
  }

  setPassword() {

    if (!this.passwordError && !this.verifyError) {
      const id = this.profileForm.value.id;    
      const passwd = this.profileForm.value.password;
      this.dialogService.showSpinner();
      this.authService.statusMessage = "Updating User Password";
      this.authService.changePassword(id, passwd)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.exception === '') {
                this.profileForm.controls['password'].setValue(undefined);
                this.profileForm.controls['password2'].setValue(undefined);
              }
            }
            this.authService.statusMessage = "Update complete";
          },
          error: (error: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = error.exception;
          }
        });
    }
  }

  onAdd() {
    if (this.profileForm.valid) {
      const email = this.profileForm.controls['email'].value;
      const first = this.profileForm.controls['first'].value;
      const middle = this.profileForm.controls['middle'].value;
      const last = this.profileForm.controls['last'].value;
      const passwd = this.profileForm.controls['password'].value;
      let perms: string[] = [];
      if (this.profileForm.controls['geoint'].value) {
        perms.push('geoint')
      }
      if (this.profileForm.controls['xint'].value) {
        perms.push('xint')
      }
      if (this.profileForm.controls['mist'].value) {
        perms.push('mist')
      }
      if (this.profileForm.controls['admin'].value) {
        perms.push('admin');
      }

      this.dialogService.showSpinner();
      this.authService.addUser(email, first, middle, last, passwd, perms)
      .subscribe({
        next: (data: UserResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.user) {
            this.user = data.user;
          }
        },
        error: (err: UserResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    } else {
      alert('Form not valid');
    }
    this.changed.emit(this.user)
  }

  onUpdate(field: string) {
    if (this.profileForm.valid) {
      if (this.user.id !== 'new' && this.user.id !== '') {
        let change = field;
        let value = this.profileForm.controls[field].value;
        switch (field.toLowerCase()) {
          case "geoint":
          case "xint":
          case "mist":
          case "admin":
            if (`${value}`.toLowerCase() === 'true') {
              change = 'addperm';
            } else {
              change = 'removeperm';
            }
            value = `metrics-${field.toLowerCase()}`;
        }
        this.dialogService.showSpinner();
        this.authService.changeUser(this.user.id, change, value).subscribe({
          next: (data: AuthenticationResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null && data.user) {
              this.user = data.user;
            }
          },
          error: (err: AuthenticationResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
        this.changed.emit(this.user);
      }
    }
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      width: '300px',
      data: {
        title: "Delete User Confirmation",
        message: "Are you sure you want to delete this user?",
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogService.showSpinner();
      this.authService.deleteUser(this.user.id).subscribe({
        next: (data: UsersResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.users) {
            this.authService.setUsers(data.users);
            const user = new User();
            user.id = 'delete';
          }
        },
        error: (err: UsersResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    });
  }

  onClear() {
    this.changed.emit(this.user);
  }
}
