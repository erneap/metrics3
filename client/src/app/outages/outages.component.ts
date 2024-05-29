import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OutageService } from '../services/outage.service';
import { DialogService } from '../services/dialog-service.service';
import { IGroundSystem } from '../models/metrics/systems';
import { GroundOutage } from '../models/metrics/groundOutage';
import { OutageResponse } from '../models/web/outageWeb';

@Component({
  selector: 'app-outages',
  templateUrl: './outages.component.html',
  styleUrls: ['./outages.component.scss']
})
export class OutagesComponent {
  outageForm: FormGroup;
  listForm: FormGroup;
  enclaves: string[] = [];
  groundSystems: string[] = [];
  outage: GroundOutage = new GroundOutage();

  constructor(
    protected authService: AuthService,
    protected outageService: OutageService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    const now = new Date();
    const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 
      now.getDate()));
    const start = new Date(end.getTime() - (365 * 24 * 3600000));
    this.outageForm = this.fb.group({
      system: '',
      enclave: '',
      outagedate: new Date(),
      outagenumber: '',
      capability: 'PMC',
      outagetime: 0,
      duringmission: false,
      subsystems: '',
      reference: 'FIX_',
      majorarea: '',
      problem: '',
      fixaction: ''
    });
    this.listForm = fb.group({
      startdate: start,
      enddate: end,
    });
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

  getListStart(): Date {
    return new Date(this.listForm.value.startdate);
  }

  getListEnd(): Date {
    return new Date(this.listForm.value.enddate);
  }

  getOutage(id: string) {
    if (id === 'new') {
      this.outage = new GroundOutage();
      this.outage.id = 'new';
      this.setOutage()
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
    this.outageForm.controls['outagetime'].setValue(this.outage.outageMinutes);
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
        value = oValue;
      }
      this.dialogService.showSpinner();
      this.outageService.updateOutage(this.outage.id, field, value).subscribe({
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
}
