import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';
import { IMission } from '../models/metrics/mission';
import { CreateMission, MissionResponse, UpdateMission } from '../models/web/missionsWeb';
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
    Observable<HttpResponse<MissionResponse>> {
    const startDate = new Date(Date.UTC(startdate.getFullYear(), 
      startdate.getMonth(), startdate.getDate()));
    const endDate = new Date(Date.UTC(enddate.getFullYear(), 
      enddate.getMonth(), enddate.getDate()));
    const url = `/metrics/api/v1/mission/dates/${this.dateString(startDate)}/`
      + `${this.dateString(endDate)}`;
    return this.httpClient.get<MissionResponse>(url, { observe: 'response'});
  }

  getMissions(platform: string, msndate: Date): Observable<HttpResponse<MissionResponse>> {
    const url = `/metrics/api/v1/missions/${this.dateString(msndate)}/${platform}`;
    return this.httpClient.get<MissionResponse>(url, { observe: 'response'});
  }

  getMission(platform: string, msndate: Date, sortie: number): Observable<HttpResponse<IMission>> {
    const url = `/metrics/api/v1/missions/${this.dateString(msndate)}/${platform}/${sortie}`;
    return this.httpClient.get<IMission>(url, {observe: 'response'});
  }

  createMission(platform: string, msndate: Date, sortie: number): 
    Observable<HttpResponse<IMission>> {
    const msnDate = new Date(Date.UTC(msndate.getFullYear(), msndate.getMonth(), 
      msndate.getDate()));
    const url = '/metrics/api/v1/mission/';
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
    return this.httpClient.post<IMission>(url, newMission, {observe: 'response'});
  }

  updateMission(change: UpdateMission): Observable<HttpResponse<IMission>> {
    const url = '/metrics/api/v1/mission/';
    return this.httpClient.put<IMission>(url, change, { observe: 'response'});
  }

  updateMissionSensor(change: UpdateMission): Observable<HttpResponse<IMission>> {
    const url = '/metrics/api/v1/mission/sensor/';
    return this.httpClient.put<IMission>(url, change, {observe: 'response'});
  }

  deleteMission(): Observable<HttpResponse<Object>> {
    const url = `/metrics/api/v1/mission/${this.selectedMission?.id}`;
    return this.httpClient.delete(url, {observe: 'response'});
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
