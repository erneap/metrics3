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
  @Input() width: number = 750;
  @Input() height: number = 400;
  private _outages: GroundOutage[] = [];
  @Input() 
  public set outages(outs: GroundOutage[]) {
    this._outages = [];
    outs.forEach(out => {
      this._outages.push(new GroundOutage(out));
    });
    this._outages.sort((a,b) => a.compareTo(b));
  }
  get outages(): GroundOutage[] {
    return this._outages;
  }
  @Output() changed = new EventEmitter<string>();

  constructor(
    protected authService: AuthService,
    protected outageService: OutageService,
    protected dialogService: DialogService,
  ) {
  }

  onChanged(change: string) {
    this.changed.emit(change);
  }

  getStyle(field: string): string {
    let ratio = this.width / 800;
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
    let ratio = this.width / 800;
    if (ratio > 1.0) ratio = 1.0;
    const width = Math.floor(800 * ratio);
    const height = this.height - 17;
    return `width: ${width}px;height: ${height}px;`
  }
}
