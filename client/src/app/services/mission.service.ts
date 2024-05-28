import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { IMission } from '../models/metrics/mission';
import { CreateMission, MissionResponse, MissionsResponse, UpdateMission } 
  from '../models/web/missionsWeb';
import { GeneralSensorType } from '../models/metrics/systems';

@Injectable({
  providedIn: 'root'
})
export class MissionService extends CacheService {
  missionError: string = '';
  selectedMission: IMission | undefined;
  missions: IMission[] = [];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    super();
  }

  getMissionsByDates(startdate: Date, enddate:Date): 
    Observable<MissionsResponse> {
    const startDate = new Date(Date.UTC(startdate.getFullYear(), 
      startdate.getMonth(), startdate.getDate()));
    const endDate = new Date(Date.UTC(enddate.getFullYear(), 
      enddate.getMonth(), enddate.getDate()));
    const url = `/api/v2/metrics/mission/dates/${this.dateString(startDate)}/`
      + `${this.dateString(endDate)}`;
    return this.httpClient.get<MissionsResponse>(url);
  }

  getMissions(platform: string, msndate: Date): Observable<MissionsResponse> {
    const url = `/api/v2/metrics/missions/${this.dateString(msndate)}/${platform}`;
    return this.httpClient.get<MissionsResponse>(url);
  }

  getMission(platform: string, msndate: Date, sortie: number): 
    Observable<MissionResponse> {
    const url = `/api/v2/metrics/missions/${this.dateString(msndate)}/${platform}/${sortie}`;
    return this.httpClient.get<MissionResponse>(url);
  }

  createMission(platform: string, msndate: Date, sortie: number): 
    Observable<MissionResponse> {
    const msnDate = new Date(Date.UTC(msndate.getFullYear(), msndate.getMonth(), 
      msndate.getDate()));
    const url = '>/api/v2/metrics/mission/';
    const newMission: CreateMission = {
      missionDate: new Date(msnDate),
      platformID: platform,
      sortieID: sortie,
      exploitation: 'Primary',
      primaryDCGS: '',
      communications: 'LOS',
      tailNumber: '',
      overlap: 0,
      executed: true,
      aborted: false,
      cancelled: false,
      indefDelay: false,
      sensors: []
    };
    if (this.authService.systemInfo && this.authService.systemInfo.platforms) {
      this.authService.systemInfo.platforms.forEach(plat => {
        if (plat.id.toLowerCase() === platform.toLowerCase()) {
          let geoint = false;
          let xint = false;
          let mist = false;
          plat.sensors.forEach(sen => {
            if (sen.generalType === GeneralSensorType.GEOINT && !geoint) {
              newMission.sensors.push(sen.id);
              geoint = true;
            } else if (sen.generalType === GeneralSensorType.XINT && !xint) {
              newMission.sensors.push(sen.id);
              xint = true;
            } else if (sen.generalType === GeneralSensorType.MIST && !mist) {
              newMission.sensors.push(sen.id);
              mist = true;
            }
          });
        }
      });
    }
    return this.httpClient.post<MissionResponse>(url, newMission);
  }

  updateMission(id: string, field: string, value: string): Observable<MissionResponse> {
    const url = '/api/v2/metrics/mission/';
    const data: UpdateMission = {
      id: id,
      field: field,
      value: value
    };
    return this.httpClient.put<MissionResponse>(url, data);
  }

  updateMissionSensor(id: string, sensor: string, field: string, value: string, 
    imageType?: string, imageSubType?: string): Observable<MissionResponse> {
    const url = '/api/v2/metrics/mission/sensor/';
    const change: UpdateMission = {
      id: id,
      sensorID: sensor,
      field: field,
      value: value
    };
    if (imageType) {
      change.imageTypeID = imageType;
      if (imageSubType) {
        change.imageSubTypeID = imageSubType;
      }
    }
    return this.httpClient.put<MissionResponse>(url, change);
  }

  deleteMission(): Observable<MissionResponse> {
    const url = `/api/v2/metrics/mission/${this.selectedMission?.id}`;
    return this.httpClient.delete<MissionResponse>(url);
  }

  private dateString(msndate:Date): string {
    let sDate = `${msndate.getFullYear()}-`;
    if (msndate.getMonth() + 1 < 10) {
      sDate += "0";
    }
    sDate += `${msndate.getMonth() + 1}-`;
    if (msndate.getDate() < 10) {
      sDate += "0";
    }
    sDate += `${msndate.getDate()}`;
    return sDate
  }
}
