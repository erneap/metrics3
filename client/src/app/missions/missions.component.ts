import { Component } from '@angular/core';
import { Mission } from '../models/metrics/mission';
import { AuthService } from '../services/auth.service';
import { MissionService } from '../services/mission.service';
import { DialogService } from '../services/dialog-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItem } from '../generic/button-list/listitem';
import { Communication, Dcgs, IExploitation, SystemInfo } from '../models/metrics/systems';
import { MissionResponse, MissionsResponse } from '../models/web/missionsWeb';
import { MissionNewDialogComponent } from './mission-new-dialog/mission-new-dialog.component';
import { SystemInfoResponse } from '../models/web/userWeb';
import { AppStateService } from '../services/app-state.service';
import { MissionDeleteDialogComponent } from './mission-delete-dialog/mission-delete-dialog.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.scss'],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true}},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class MissionsComponent {
  mission?: Mission = undefined;
  sorties: string[] = [];
  platforms: string[] = [];
  communications: string[] = [];
  dcgsList: string[] = [];
  missionForm: FormGroup;

  constructor(
    protected authService: AuthService,
    protected msnService: MissionService,
    protected dialogService: DialogService,
    protected appState: AppStateService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    let now = new Date();
    now = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 
      now.getUTCDate()));
    this.missionForm = this.fb.group({
      msndate: [now, [Validators.required]],
      platform: ['', [Validators.required ]],
      sortie: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      exploitation: ['', [Validators.required]],
      tailnumber: '',
      communications: ['', [Validators.required]],
      dcgs: '',
      overlap: ['0:00', [Validators.pattern("^[0-9]{0,2}:[0-9]{2}$")]],
      comments: '',
      isExecuted: 'none',
      imintsensor: '',
    });
    this.platforms = [];
    if (!this.authService.systemInfo) {
      this.dialogService.showSpinner();
      this.authService.statusMessage = 'Getting Initial Information';
      this.authService.systemData().subscribe({
        next: (data: SystemInfoResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.systemInfo) {
            this.authService.systemInfo = new SystemInfo(data.systemInfo);
            this.authService.systemInfo.platforms.forEach(plat => {
              this.platforms.push(plat.id);
            });
          }
        },
        error: (err: SystemInfoResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
    }
    if (this.authService.systemInfo && this.authService.systemInfo.platforms) {
      this.authService.systemInfo.platforms.forEach(plat => {
        console.log(plat.id);
        this.platforms.push(plat.id);
      });
    }
  }

  setMission() {
    if (this.mission) {
      this.missionForm.controls["sortie"].setValue(`${this.mission.sortieID}`);
      this.missionForm.controls["exploitation"].setValue(
        this.mission.exploitation);
      this.missionForm.controls["exploitation"].enable();
      this.setCommunications();
      this.setDCGSs();
      this.missionForm.controls["tailnumber"].setValue(
        this.mission.tailNumber);
      this.missionForm.controls["tailnumber"].enable();
      this.missionForm.controls["communications"].setValue(
        this.mission.communications);
      this.missionForm.controls["communications"].enable();
      this.missionForm.controls["dcgs"].setValue(
        this.mission.primaryDCGS);
      this.missionForm.controls["dcgs"].enable();
      this.missionForm.controls["overlap"].setValue(
        this.convertOverlapToString(this.mission.missionOverlap));
        this.missionForm.controls["overlap"].enable();
      this.missionForm.controls["comments"].setValue(
        this.mission.comments);
      this.missionForm.controls["comments"].enable();
      this.missionForm.controls['isExecuted'].setValue('none');
      if (this.mission.executed) {
        this.missionForm.controls['isExecuted'].setValue('executed');
      } else if (this.mission.cancelled) {
        this.missionForm.controls['isExecuted'].setValue('cancelled');
      } else if (this.mission.aborted) {
        this.missionForm.controls['isExecuted'].setValue('aborted');
      } else if (this.mission.indefDelay) {
        this.missionForm.controls['isExecuted'].setValue('indefdelay');
      }
      this.missionForm.controls["isExecuted"].enable();
      this.missionForm.controls["imintsensor"].setValue(
        this.showMissionSensor());
      this.missionForm.controls["imintsensor"].enable();
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
    if (this.mission && this.mission) {
      this.mission.sensors.forEach(sen => {
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

  onDelete() {
    const dialogRef = this.dialog.open(MissionDeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes' && this.mission && this.mission.id) {
        this.dialogService.showSpinner();
        this.msnService.deleteMission(this.mission.id)
          .subscribe({
            next: (resp: MissionResponse) => {
              this.dialogService.closeSpinner();
              let found = -1;
              for (let i=0; i < this.sorties.length && found < 0; i++) {
                if (`${this.mission?.sortieID}` === this.sorties[i]) {
                  found = i;
                }
              }
              if (found >= 0) {
                this.sorties.splice(found, 1);
              }
              this.mission = undefined;
              this.setMission();
            },
            error: (err: MissionResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          })
      }
    });
  }

  clearMission() {
    this.mission = undefined;
    this.setMission();
  }

  getSortie(field: string) {
    const msnDate = new Date(this.missionForm.value.msndate);
    const platform = this.missionForm.value.platform;
    let sortieID = this.missionForm.value.sortie;
    const reMsn = new RegExp('^[0-9]*$');
    if (field.toLowerCase() === 'msndate' || field.toLowerCase() === 'platform') {
      this.sorties = [];
      this.sorties.push('new');

      if (msnDate.getTime() > 0 && platform !== '') {
        this.dialogService.showSpinner();
        this.msnService.getMissions(platform, msnDate).subscribe({
          next: (data: MissionsResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null && data.missions) {
              data.missions.forEach(msn => {
                this.sorties.push(`${msn.sortieID}`);
              });
              if (data.missions.length > 0) {
                this.mission = new Mission(data.missions[0]);
                this.setMission()
              } else if (data.missions.length <= 0) {
                this.mission = undefined;
                this.setMission();
              } 
            } else {
              this.mission = undefined;
              this.setMission();
            }
          },
          error: (err: MissionResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        })
      }
    } else if (msnDate.getTime() !== 0 && platform !== '' && sortieID === 'new') {
      const dialogRef = this.dialog.open(MissionNewDialogComponent, {
        data: { sortieID: ''},
      });
      dialogRef.afterClosed().subscribe(result => {
        sortieID = result;
        if (sortieID && sortieID !== '' && reMsn.test(sortieID) 
          && Number(sortieID) > 0) {
          this.dialogService.showSpinner();
          this.msnService.createMission(platform, msnDate, Number(sortieID))
          .subscribe({
            next: (data: MissionResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null && data.mission) {
                this.sorties.push(`${data.mission.sortieID}`);
                this.mission = new Mission(data.mission);
                this.setMission();
              } 
            },
            error: (err: MissionResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception
            }
          });
        }
      });
    } else if (msnDate.getTime() !== 0 && platform !== '' 
      && reMsn.test(sortieID) && Number(sortieID) > 0) {
      this.dialogService.showSpinner();
      this.msnService.getMission(platform, msnDate, Number(sortieID)).subscribe({
        next: (data: MissionResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.mission) {
            this.mission = new Mission(data.mission);
            this.setMission();
          } 
        },
        error: (err: MissionResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception
        }
      });
    }
  }

  getExploitations(): IExploitation[] {
    if (this.authService.systemInfo && this.authService.systemInfo.exploitations) {
      return this.authService.systemInfo.exploitations;
    }
    return [];
  }

  updateMission(field: string) {
    let value = this.missionForm.controls[field].value;
    if (field.toLowerCase() === 'overlap') {
      value = String(this.convertOverlapStringToMinutes(value));
    }
    if (this.mission && this.mission.id && value !== '') {
      this.dialogService.showSpinner();
      this.msnService.updateMission(this.mission.id, field, value).subscribe({
        next: (data: MissionResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.mission) {
            this.mission = new Mission(data.mission);
            this.setMission();
          }
        },
        error: (err: MissionResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  showTailNumber(): boolean {
    let answer = false;
    if (this.mission && this.authService.systemInfo 
      && this.authService.systemInfo.platforms) {
      this.authService.systemInfo.platforms.forEach(plat => {
        if (plat.id === this.mission?.platformID) {
          plat.sensors.forEach(sen => {
            if (sen.showTailNumber) {
              answer = true;
            }
          })
        }
      })
    }
    return answer
  }

  commentsStyle(): string {
    let ratio = this.appState.viewWidth / 800;
    if (ratio > 1.0) ratio = 1.0;
    const width = Math.floor(800 * ratio);
    return `width: ${width}px;font-size: ${ratio}rem !important;`;
  }

  showSensor(sensorID: string): boolean {
    let answer = false;
    const platform = this.missionForm.value.platform;
    const exploit = this.missionForm.value.exploitation;

    if (this.authService.systemInfo && this.authService.systemInfo.platforms) {
      this.authService.systemInfo.platforms.forEach(plat => {
        if (plat.id === platform) {
          plat.sensors.forEach(sen => {
            if (sen.id === sensorID) {
              sen.exploitations.forEach(exp => {
                if (exp.exploitation.toLowerCase().indexOf(
                  exploit.toLowerCase()) >= 0) {
                  answer = true;
                }
              })
            }
          });
        }
      });
    }
    return answer;
  }
}
