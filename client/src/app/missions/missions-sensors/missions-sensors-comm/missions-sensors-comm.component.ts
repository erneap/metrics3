import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sensor } from 'src/app/models/metrics/abstractSensor';
import { IMission, Mission } from 'src/app/models/metrics/mission';
import { MissionSensor } from 'src/app/models/metrics/missionSensor';
import { GeneralSensorType } from 'src/app/models/metrics/systems';
import { MissionResponse } from 'src/app/models/web/missionsWeb';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { MissionService } from 'src/app/services/mission.service';

@Component({
  selector: 'app-missions-sensors-comm',
  templateUrl: './missions-sensors-comm.component.html',
  styleUrls: ['./missions-sensors-comm.component.scss']
})
export class MissionsSensorsCommComponent extends Sensor {
  private _mission: Mission = new Mission();
  @Input() 
  public set mission(m: IMission) {
    this._mission = new Mission(m);
    this.missionSensor();
  }
  get mission(): Mission {
    return this._mission;
  }
  @Output() changed = new EventEmitter<Mission>();
  geoint: MissionSensor = new MissionSensor();
  geointForm: FormGroup;

  finalCodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  towers = [ 1, 2, 3 ];

  constructor(
    protected authService: AuthService,
    protected msnService: MissionService,
    protected dialogService: DialogService,
    protected appState: AppStateService,
    private fb: FormBuilder
  ) {
    super();
    this.geointForm = this.fb.group({
      kitnumber: '',
      finalcode: 0,
      premission: '0:00',
      scheduled: '0:00',
      executed: '0:00',
      postmission: '0:00',
      additional: '0:00',
      comments: '',
      hashap: false,
      tower: 0,
      sensorout: 0,
      groundout: 0,
    });
  }

  missionSensor() {
    this.geoint = new MissionSensor();
    if (this.mission && this.mission 
      && this.mission.sensors) {
      this.mission.sensors.forEach(sen => {
        if (sen.sensorType && sen.sensorType === GeneralSensorType.MIST) {
          this.geoint = new MissionSensor(sen);
        }
      });
    }
    this.setSensor();
  }

  clearSensor() {
    this.geoint = new MissionSensor();
    this.geoint.sensorType = GeneralSensorType.GEOINT;
    if (this.mission.id) {
      this.msnService.updateMissionSensor(this.mission.id, this.geoint.sensorID, 
      'reset', '').subscribe({
        next: (data: MissionResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.mission) {
            this.mission = new Mission(data.mission);
            this.changed.emit(this.mission);
          }
        },
        error: (err: MissionResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
    }
    this.setSensor()
  }

  setSensor() {
    this.geointForm.controls['kitnumber'].setValue(this.geoint.kitNumber);
    this.geointForm.controls['finalcode'].setValue(this.geoint.finalCode);
    this.geointForm.controls['premission'].setValue(
      this.convertMinutesToTimeString(this.geoint.preflightMinutes)
    );
    this.geointForm.controls['scheduled'].setValue(
      this.convertMinutesToTimeString(this.geoint.scheduledMinutes)
    );
    this.geointForm.controls['executed'].setValue(
      this.convertMinutesToTimeString(this.geoint.executedMinutes)
    );
    this.geointForm.controls['postmission'].setValue(
      this.convertMinutesToTimeString(this.geoint.postflightMinutes)
    );
    this.geointForm.controls['additional'].setValue(
      this.convertMinutesToTimeString(this.geoint.additionalMinutes)
    );
    this.geointForm.controls['sensorout'].setValue(
      this.geoint.sensorOutage.totalOutageMinutes);
    this.geointForm.controls['groundout'].setValue(this.geoint.groundOutage);
    this.geointForm.controls['hashap'].setValue(this.geoint.hasHap);
    this.geointForm.controls['tower'].setValue(this.geoint.towerID);
    this.geointForm.controls['comments'].setValue(this.geoint.comments);
  }

  UpdateSensor(field: string) {
    let value = this.geointForm.controls[field].value;
    switch (field.toLowerCase()) {
      case "finalcode":
      case "tower":
      case "sensorout":
      case "groundout":
        value = String(value);
        break;
      case "premission":
      case "scheduled":
      case "executed":
      case "postmission":
      case "additional":
        value = String(this.convertTimeStringToMinutes(value));
        break;
      case "hashap":
        value = `${value}`;
        break;
    }
    this.dialogService.showSpinner();
    if (this.mission.id) {
      this.msnService.updateMissionSensor(this.mission.id, this.geoint.sensorID,
      field, value).subscribe({
        next: (data: MissionResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null && data.mission) {
            this.mission = new Mission(data.mission);
            this.changed.emit(this.mission);
          }
        },
        error: (err: MissionResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  commentsStyle(): string {
    let ratio = this.appState.viewWidth / 800;
    if (ratio > 1.0) ratio = 1.0;
    const width = Math.floor(800 * ratio);
    return `width: ${width}px;font-size: ${ratio}rem !important;`;
  }
}
