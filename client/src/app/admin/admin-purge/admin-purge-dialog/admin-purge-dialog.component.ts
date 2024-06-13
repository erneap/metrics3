import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-purge-dialog',
  templateUrl: './admin-purge-dialog.component.html',
  styleUrl: './admin-purge-dialog.component.scss'
})
export class AdminPurgeDialog {
  yes: string = 'yes';
  no: string = 'no';

  constructor(
    public dialogRef: MatDialogRef<AdminPurgeDialog>,
  ) {}
}
