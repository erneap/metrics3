import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OutageService } from '../services/outage.service';
import { DialogService } from '../services/dialog-service.service';
import { IGroundSystem, SystemInfo } from '../models/metrics/systems';
import { GroundOutage } from '../models/metrics/groundOutage';
import { OutageResponse, OutagesResponse } from '../models/web/outageWeb';
import { SystemInfoResponse } from '../models/web/userWeb';
import { AppStateService } from '../services/app-state.service';

@Component({
  selector: 'app-outages',
  templateUrl: './outages.component.html',
  styleUrls: ['./outages.component.scss']
})
export class OutagesComponent {
  outageForm: FormGroup;
  enclaves: string[] = [];
  groundSystems: string[] = [];
  outage: GroundOutage = new GroundOutage();
  start: Date;
  end: Date;
  outages: GroundOutage[] = [];

  constructor(
    protected authService: AuthService,
    protected outageService: OutageService,
    protected dialogService: DialogService,
    protected appState: AppStateService,
    private fb: FormBuilder
  ) {
    const now = new Date();
    this.end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 
      now.getDate()));
    this.start = new Date(this.end.getTime() - (365 * 24 * 3600000));
    this.outageForm = this.fb.group({
      system: '',
      enclave: '',
      outagedate: new Date(),
      outagenumber: 1,
      capability: 'PMC',
      outageminutes: 0,
      duringmission: false,
      subsystems: '',
      reference: 'FIX_',
      majorarea: '',
      problem: '',
      fixaction: ''
    });
    if (!authService.systemInfo) {
      this.dialogService.showSpinner();
      this.authService.systemData().subscribe({
        next: (data: SystemInfoResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.systemInfo) {
            this.authService.systemInfo = new SystemInfo(data.systemInfo);
          }
        },
        error: (err: SystemInfoResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
    }
    this.getOutages();
  }

  getOutages() {
    const now = new Date();
    const start = new Date(now.getTime() - (365 * 24 * 3600000));
    this.dialogService.showSpinner();
    this.outageService.getOutagesForPeriod(start, now).subscribe({
      next: (data: OutagesResponse) => {
        this.dialogService.closeSpinner();
        this.outages = [];
        if (data && data !== null && data.outages) {
          data.outages.forEach(out => {
            this.outages.push(new GroundOutage(out));
          });
        }
      },
      error: (err: OutagesResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    })
  }

  getSystem(): IGroundSystem[] {
    if (this.authService.systemInfo 
      && this.authService.systemInfo.groundSystems) {
      return this.authService.systemInfo.groundSystems;
    }
    return [];
  }

  clearOutage() {
    this.outageForm.reset();
  }

  getSystemEnclaves(): string[] {
    let answer: string[] = [];
    if (this.authService.systemInfo 
      && this.authService.systemInfo.groundSystems) {
      this.authService.systemInfo.groundSystems.forEach(gs => {
        if (gs.id === this.outageForm.value.system) {
          gs.enclaves.forEach(enc => {
            answer.push(enc);
          });
        }
      });
    }
    return answer;
  }

  getOutage(id: string) {
    if (id === 'new') {
      this.outage = new GroundOutage();
      this.outage.id = 'new';
      this.setOutage();
    } else if (id === 'refresh') {
      this.outage = new GroundOutage();
      this.outage.id = 'new';
      this.setOutage();
      this.getOutages();
    } else {
      this.dialogService.showSpinner();
      this.outageService.getOutage(id).subscribe({
        next: (data: OutageResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.outage) {
            this.outage = new GroundOutage(data.outage);
            this.setOutage();
          }
        },
        error: (err: OutageResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
    }
  }

  setOutage() {
    this.outageForm.controls['system'].setValue(
      this.outage.groundSystem.toUpperCase());
    this.outageForm.controls['enclave'].setValue(this.outage.classification);
    this.outageForm.controls['outagedate'].setValue(
      new Date(this.outage.outageDate));
    this.outageForm.controls['outagenumber'].setValue(this.outage.outageNumber);
    this.outageForm.controls['outageminutes'].setValue(this.outage.outageMinutes);
    this.outageForm.controls['duringmission'].setValue(this.outage.missionOutage);
    this.outageForm.controls['subsystems'].setValue(this.outage.subSystem);
    this.outageForm.controls['reference'].setValue(this.outage.referenceId);
    this.outageForm.controls['majorarea'].setValue(this.outage.majorSystem);
    this.outageForm.controls['problem'].setValue(this.outage.problem);
    this.outageForm.controls['fixaction'].setValue(this.outage.fixAction);
    this.outageForm.controls['capability'].setValue(
      (this.outage.capability) ? this.outage.capability : 'PMC'
    );
  }

  updateOutage(field: string) {
    if (this.outage.id && this.outage.id !== 'new' && this.outage.id !== '') {
      let value = '';
      const oValue = this.outageForm.controls[field].value;
      if (field.toLowerCase() === 'outagedate') {
        value = this.dateString(oValue);
      } else {
        value = `${oValue}`;
      }
      this.dialogService.showSpinner();
      this.outageService.updateOutage(this.outage.id, field, value).subscribe({
        next: (data: OutageResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.outage) {
            this.outage = new GroundOutage(data.outage);
            this.setOutage();
            this.getOutages();
          }
        },
        error: (err: OutageResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
    }
  }

  onAdd() {
    if (this.outage.id && (this.outage.id === 'new' || this.outage.id === '')) {
      const system = this.outageForm.value.system;
      const enclave = this.outageForm.value.enclave;
      const outageDate = new Date(this.outageForm.value.outagedate);
      this.dialogService.showSpinner();
      this.outageService.createOutage(system, enclave, outageDate).subscribe({
        next: (data: OutageResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.outage) {
            this.outage = new GroundOutage(data.outage);
            this.setOutage();
            this.getOutages();
          }
        },
        error: (err: OutageResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
    }
  }

  onClear() {
    this.outage = new GroundOutage();
    this.outage.id = 'new';
    this.setOutage();
  }

  dateString(dt: Date): string {
    let answer = `${dt.getFullYear()}-`;
    if (dt.getMonth() < 9) {
      answer += '0';
    }
    answer += `${dt.getMonth() + 1}/`;
    if (dt.getDate() < 10) {
      answer += '0';
    }
    answer += `${dt.getDate()}`;
    return answer;
  }

  problemStyle(): string {
    let ratio = this.appState.viewWidth / 800;
    if (ratio > 1.0) ratio = 1.0;
    const width = Math.floor(750 * ratio);
    return `width: ${width}px;font-size: ${ratio}rem;`;
  }
}
