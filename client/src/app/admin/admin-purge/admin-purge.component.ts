import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { AdminPurgeDialog } from './admin-purge-dialog/admin-purge-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-admin-purge',
  templateUrl: './admin-purge.component.html',
  styleUrls: ['./admin-purge.component.scss']
})
export class AdminPurgeComponent {
  purgeForm: FormGroup;

  constructor(
    protected adminService: AdminService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.purgeForm = this.fb.group({
      mission: false,
      outages: false,
      purgedate: new Date(),
    });
  }

  verifyPurge(): void {
    const dialogRef = this.dialog.open(AdminPurgeDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
        const fDate = new Date(this.purgeForm.value.purgedate);
        const pDate = new Date(Date.UTC(fDate.getUTCFullYear(), fDate.getUTCMonth(),
          fDate.getUTCDate()));

        if (this.purgeForm.value.mission) {
          this.dialogService.showSpinner();
          this.adminService.purgeMissions(pDate)
            .subscribe({
              next: (resp) => {
                this.dialogService.closeSpinner();
              },
              error: (err) => {
                this.dialogService.closeSpinner();
                console.log(err);
              }
            });
        }
        if (this.purgeForm.value.outages) {
          this.dialogService.showSpinner();
          this.adminService.purgeOutages(pDate)
          .subscribe({
            next: (resp) => {
              this.dialogService.closeSpinner();
            },
            error: (err) => {
              this.dialogService.closeSpinner();
              console.log(err);
            }
          });
        }
      }
      this.purgeForm.reset();
    });
  }
}
