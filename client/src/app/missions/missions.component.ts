import { Component } from '@angular/core';
import { Mission } from '../models/metrics/mission';
import { AuthService } from '../services/auth.service';
import { MissionService } from '../services/mission.service';
import { DialogService } from '../services/dialog-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItem } from '../generic/button-list/listitem';
import { Communication, Dcgs } from '../models/metrics/systems';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss']
})
export class MissionsComponent {
  mission?: Mission = undefined;
  sorties: ListItem[] = [];
  communications: string[] = [];
  dcgsList: string[] = [];
  missionForm: FormGroup;

  constructor(
    protected authService: AuthService,
    protected msnService: MissionService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.missionForm = this.fb.group({
      msndate: [new Date(), [Validators.required]],
      platform: ['', [Validators.required ]],
      sortie: ['new', [Validators.required, Validators.pattern("^[0-9]+$")]],
      exploitation: ['', [Validators.required]],
      tailnumber: '',
      communications: ['', [Validators.required]],
      dcgs: '',
      overlap: ['0:00', [Validators.pattern("^[0-9]{0,2}:[0-9]{2}$")]],
      comments: '',
      isExecuted: 'none',
      imintsensor: '',
    });
  }

  setMission() {
    if (this.mission && this.mission?.missionData) {
      this.missionForm.controls["sortie"].setValue(`${this.mission.sortieID}`);
      this.missionForm.controls["exploitation"].setValue(
        this.mission.missionData.exploitation);
      this.missionForm.controls["exploitation"].enable();
      this.setCommunications();
      this.setDCGSs();
      this.missionForm.controls["tailnumber"].setValue(
        this.mission.missionData.tailNumber);
      this.missionForm.controls["tailnumber"].enable();
      this.missionForm.controls["communications"].setValue(
        this.mission.missionData.communications);
      this.missionForm.controls["communications"].enable();
      this.missionForm.controls["dcgs"].setValue(
        this.mission.missionData.primaryDCGS);
      this.missionForm.controls["dcgs"].enable();
      this.missionForm.controls["overlap"].setValue(
        this.convertOverlapToString(this.mission.missionData.missionOverlap));
        this.missionForm.controls["overlap"].enable();
      this.missionForm.controls["comments"].setValue(
        this.mission.missionData.comments);
      this.missionForm.controls["comments"].enable();
      this.missionForm.controls['isExecuted'].setValue('none');
      if (this.mission.missionData.executed) {
        this.missionForm.controls['isExecuted'].setValue('executed');
      } else if (this.mission.missionData.cancelled) {
        this.missionForm.controls['isExecuted'].setValue('cancelled');
      } else if (this.mission.missionData.aborted) {
        this.missionForm.controls['isExecuted'].setValue('aborted');
      } else if (this.mission.missionData.indefDelay) {
        this.missionForm.controls['isExecuted'].setValue('indefdelay');
      }
      this.missionForm.controls["isExecuted"].enable();
      this.missionForm.controls["imintsensor"].setValue(
        this.showMissionSensor());
    } else {
      this.missionForm.controls["sortie"].setValue('');
      this.missionForm.controls["exploitation"].setValue('');
      this.missionForm.controls["exploitation"].disable();
      this.setCommunications();
      this.setDCGSs();
      this.missionForm.controls["tailnumber"].setValue('');
      this.missionForm.controls["tailnumber"].disable();
      this.missionForm.controls["communications"].setValue('');
      this.missionForm.controls["communications"].disable();
      this.missionForm.controls["dcgs"].setValue('');
      this.missionForm.controls["dcgs"].disable();
      this.missionForm.controls["overlap"].setValue('0:00');
      this.missionForm.controls["overlap"].disable();
      this.missionForm.controls["comments"].setValue('');
      this.missionForm.controls["comments"].disable();
      this.missionForm.controls['isExecuted'].setValue('none');
      this.missionForm.controls["isExecuted"].disable();
      this.missionForm.controls["imintsensor"].setValue('');
      this.missionForm.controls["imintsensor"].disable();
    }
  }

  convertOverlapStringToMinutes(overlap: string): number {
    let times = overlap.split(":");
    const minutes = (Number(times[0]) * 60) + Number(times[1]);
    return minutes;
  }

  convertOverlapToString(minutes: number): string {
    let hours = Math.floor(minutes/60);
    let remaining = minutes - (hours * 60);
    if (remaining < 10) {
      return `${hours}:0${remaining}`;
    } else {
      return `${hours}:${remaining}`;
    }
  }

  setCommunications() {
    this.communications = [];
    const exp = this.missionForm.value.exploitation;
    if (this.authService.systemInfo 
      && this.authService.systemInfo.communications) {
      this.authService.systemInfo.communications.forEach(iComm => {
        const comm = new Communication(iComm);
        if (comm.hasExploitation(exp)) {
          this.communications.push(comm.id);
        }
      });
    }
  }

  setDCGSs() {
    this.dcgsList = [];
    const exp = this.missionForm.value.exploitation;
    if (this.authService.systemInfo && this.authService.systemInfo.dCGSs) {
      this.authService.systemInfo.dCGSs.forEach(iDcgs => {
        const dcgs = new Dcgs(iDcgs);
        if (dcgs.hasExploitation(exp)) {
          this.dcgsList.push(dcgs.id);
        }
      });
    }
  }

  showMissionSensor(): string {
    let answer = '';
    let exploit = this.missionForm.value.exploitation.toLowerCase();
    if (this.mission && this.mission.missionData) {
      this.mission.missionData.sensors.forEach(sen => {
        if (this.authService.systemInfo) {
          this.authService.systemInfo.platforms.forEach(plat => {
            plat.sensors.forEach(pSen => {
              if (pSen.id === sen.sensorID) {
                pSen.exploitations.forEach(exp => {
                  if (exp.exploitation.toLowerCase().indexOf(exploit) >= 0
                    && exp.showOnGEOINT) {
                      answer = sen.sensorID
                    }
                });
              }
            })
          });
        }
      });
    }
    return answer;
  }
}
