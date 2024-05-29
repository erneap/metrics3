import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { GroundOutage } from 'src/app/models/metrics/groundOutage';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { OutageService } from 'src/app/services/outage.service';

@Component({
  selector: 'app-outages-list-item',
  templateUrl: './outages-list-item.component.html',
  styleUrls: ['./outages-list-item.component.scss']
})
export class OutagesListItemComponent {
  @Input() width: number = 1050;
  @Input() outage: GroundOutage = new GroundOutage();
  @Input() even: boolean = false;
  @Output() changed = new EventEmitter<string>();

  constructor(
    protected authService: AuthService,
    protected outageService: OutageService,
    protected dialogService: DialogService,
    private dialog: MatDialog
  ) {}

  onClick() {
    this.changed.emit(this.outage.id);
  }
  
  onDelete() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      width: '250px',
      data: {
        title: "Delete Ground Outage",
        message: "Are you sure you want to delete this ground outage?"
      }
    })
  }

  getStyle(field: string): string {
    let ratio = this.width / 1050;
    if (ratio > 1.0) ratio = 1.0;
    const fontSize = .8 * ratio;
    let width = 100;
    switch (field.toLowerCase()) {
      case "date":
      case "number":
      case "capability":
        width = Math.floor(100 * ratio);
        break;
      case "system":
      case "classification":
        width = Math.floor(150 * ratio);
        break;
      case "problem":
        width = Math.floor(400 * ratio);
        break;
      case "delete":
        width = Math.floor(50 * ratio);
        break;
    }
    let backColor = 'ffffff';
    if (this.even) {
      backColor = 'c4b1e7';
    }
    return `width: ${width}px;font-size: ${fontSize}rem;`
      + `background-color: #${backColor};`;
  }

  getDate(outageDate: Date): string {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec" ];
    if (outageDate.getDate() < 10) {
      return `0${outageDate.getDate()} ${months[outageDate.getMonth()]} ${outageDate.getFullYear()}`;
    } else {
      return `${outageDate.getDate()} ${months[outageDate.getMonth()]} ${outageDate.getFullYear()}`;
    }
  }
}
