import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroundOutage } from 'src/app/models/metrics/groundOutage';
import { OutagesResponse } from 'src/app/models/web/outageWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { OutageService } from 'src/app/services/outage.service';

@Component({
  selector: 'app-outages-list',
  templateUrl: './outages-list.component.html',
  styleUrls: ['./outages-list.component.scss']
})
export class OutagesListComponent {
  @Input() width: number = 1050;
  @Input() height: number = 400;
  private _start: Date = new Date();
  @Input()
  public set start(dt: Date) {
    if (this._start.getTime() !== dt.getTime()) {
      this._start = new Date(dt);
      this.setOutages();
    }
  }
  get start(): Date {
    return this._start;
  }
  private _end: Date = new Date();
  @Input()
  public set end(dt: Date) {
    if (this._end.getTime() !== dt.getTime()) {
      this._end = new Date(dt);
      this.setOutages();
    }
  }
  get end(): Date {
    return this._end;
  }
  @Output() changed = new EventEmitter<string>();
  outages: GroundOutage[] = [];

  constructor(
    protected authService: AuthService,
    protected outageService: OutageService,
    protected dialogService: DialogService,
  ) {
    const now = new Date();
    this.end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 
      now.getDate()));
    this.start = new Date(this.end.getTime() - (365 * 24 * 3600000));
  }

  setOutages() {
    this.dialogService.showSpinner();
    this.outageService.getOutagesForPeriod(this.start, this.end).subscribe({
      next: (data: OutagesResponse) => {
        this.dialogService.closeSpinner();
        this.outages = [];
        if (data && data !== null && data.outages) {
          data.outages.forEach(out => {
            this.outages.push(new GroundOutage(out));
          });
          this.outages.sort((a,b) => a.compareTo(b));
        }
      },
      error: (err: OutagesResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    })
  }

  onChanged(change: string) {
    if (change.toLowerCase() === 'refresh') {
      this.setOutages();
    } else {
      this.changed.emit(change);
    }
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
    let backColor = '000000';
    return `width: ${width}px;font-size: ${fontSize}rem;`
      + `background-color: #${backColor};color: white;`;
  }

  listStyle(): string {
    const height = this.height - 17;
    return `width: ${this.width}px;height: ${height}px;`
  }
}
