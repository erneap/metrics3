import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SortieData } from '../missions-change-sortie-dialog/missions-change-sortie-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mission-new-dialog',
  templateUrl: './mission-new-dialog.component.html',
  styleUrls: ['./mission-new-dialog.component.scss']
})
export class MissionNewDialogComponent {
  sortieForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MissionNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SortieData,
    private fb: FormBuilder
  ) {
    this.sortieForm = this.fb.group({
      sortie: [this.data.sortieID, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
