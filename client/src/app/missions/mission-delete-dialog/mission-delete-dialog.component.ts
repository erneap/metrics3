import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mission-delete-dialog',
  templateUrl: './mission-delete-dialog.component.html',
  styleUrls: ['./mission-delete-dialog.component.scss']
})
export class MissionDeleteDialogComponent {
  yes: string = 'yes';
  no: string = 'no';

  constructor(
    public dialogRef: MatDialogRef<MissionDeleteDialogComponent>,
  ) {}
}
