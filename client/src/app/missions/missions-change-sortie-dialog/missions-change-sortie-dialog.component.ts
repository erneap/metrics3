import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SortieData {
  sortieID: string;
}
@Component({
  selector: 'app-missions-change-sortie-dialog',
  templateUrl: './missions-change-sortie-dialog.component.html',
  styleUrls: ['./missions-change-sortie-dialog.component.scss']
})
export class MissionsChangeSortieDialogComponent {
  sortieForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MissionsChangeSortieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SortieData,
    private fb: FormBuilder
  ) {
    console.log(this.data.sortieID);
    this.sortieForm = this.fb.group({
      sortie: [this.data.sortieID, [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
