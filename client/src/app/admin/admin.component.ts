import { Component, Input } from '@angular/core';
import { ListItem } from '../generic/button-list/listitem';
import { IUser, User } from '../models/users/user';
import { AuthService } from '../services/auth.service';
import { AppStateService } from '../services/app-state.service';
import { DialogService } from '../services/dialog-service.service';
import { UsersResponse } from '../models/web/userWeb';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../models/validators/password-strength-validator.directive';
import { MustMatchValidator } from '../models/validators/must-match-validator.directive';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  private _width: number = 1048;
  @Input()
  public set width(w: number) {
    this._width = w;
  }
  get width(): number {
    return this._width;
  }
  private _height: number = 1048;
  @Input()
  public set height(h: number) {
    this._height = h;
  }
  get height(): number {
    return this._height;
  }

  activeOnly: boolean = true;
  users: User[] = [];
  selected: User;

  constructor(
    protected authService: AuthService,
    protected appState: AppStateService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.width = this.appState.viewWidth;
    this.height = this.appState.viewHeight - 12;
    this.selected = new User();
    this.authService.clearUsers();
    this.setUsers();
  }

  setUsers() {
    this.users = [];
    const users = this.authService.getUsers();
    if (users) {
      users.forEach(usr => {
        this.users.push(new User(usr));
      });
      this.users.sort((a,b) => a.compareTo(b));
    } else {
      this.dialogService.showSpinner();
      this.authService.getAllUsers().subscribe({
        next: (data: UsersResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.users) {
            data.users.forEach(u => {
              const usr = new User(u);
              this.users.push(new User(u));
            });
            this.users.sort((a,b) => a.compareTo(b));
          }
        },
        error: (err: UsersResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  onSelect(id: string) {
    if (id === 'new') {
      this.selected = new User();
      this.selected.id = 'new';
    } else {
      this.users.forEach(usr => {
        if (usr.id === id) {
          this.selected = new User(usr);
        }
      });
    }
  }

  onChange(user: IUser) {
    if (user.id === 'new' || user.id === '') {
      this.selected = new User();
    } else if (user.id === 'delete') {
      const users = this.authService.getUsers();
      if (users) {
        let found = -1;
        for (let i = 0; i < users.length && found < 0; i++) {
          if (this.selected.id === users[i].id) {
            found = i;
          }
        }
        if (found >= 0) {
          users.splice(found, 1);
        }
        this.authService.setUsers(users);
      }
    } else {
      let users = this.authService.getUsers();
      let found = false;
      if (users) {
        for (let i = 0; i < users.length && !found; i++) {
          if (users[i].id === user.id) {
            users[i] = new User(user);
            found = true;
          }
        }
        if (!found) {
          users.push(new User(user));
        }
        this.authService.setUsers(users);
      } else {
        users = [];
        users.push(new User(user));
        this.authService.setUsers(users);
      }
      this.selected = new User(user);
    }
  }

  pageStyle(): string {
    return `width: ${this.width}px;height: ${this.height}px;`
  }

  itemStyle(id: string): string {
    let answer = 'item';
    if (this.selected.id === id) {
      return 'item selected';
    }
    if (this.users) {
      this.users.forEach(emp => {
        if (emp.id === id) {
          if (emp.isExpired()) {
            answer = 'item expired';
          } else if (emp.isLocked()) {
            answer = 'item locked';
          }
        }
      });
    }
    return answer;
  }
}
