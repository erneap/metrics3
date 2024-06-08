import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../users/user';

@Directive({
  selector: '[appUsedEmailValidator]'
})
export class UsedEmailValidator implements Validator {

  constructor(
    protected authService: AuthService
  ) { }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const value: string = (control.value && control.value !== null) 
      ? control.value : '';
    const formGroup = control.parent;
    let userid = '';
    if (formGroup) {
      userid = String(formGroup.get('id'));
    }
    if (value === '' || value === null) {
      return { usedEmail: true };
    }
    let answer: User | undefined;
    if (this.authService.getUsers()) {
      this.authService.getUsers()?.forEach(usr => {
        if (usr.emailAddress.toLowerCase() === value.toLowerCase() 
          && userid !== usr.id) {
          answer = new User(usr);
        }
      });
    }
    return answer ? { usedEmail: true } : null;
  }
}
