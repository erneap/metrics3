import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';;
import { CacheService } from './cache.service';
import { Observable, Subject } from 'rxjs';
import { GroundOutage, IGroundOutage } from '../models/metrics/groundOutage';
import { OutageResponse, OutagesResponse } from '../models/web/outageWeb';
import { UpdateRequest } from '../models/web/employeeWeb';

@Injectable({
  providedIn: 'root'
})
export class OutageService extends CacheService {
  allOutages: IGroundOutage[] = [];
  selectedOutage: IGroundOutage | undefined = undefined;
  changesMade: Subject<void> = new Subject<void>();

  constructor(
    protected httpClient: HttpClient 
  ) {
    super();

    // get all outages from database
    this.pullAllOutages();
  }

  public pullAllOutages() {
    this.allOutages = [];
    const url = '/api/v2/metrics/outage/';
    this.httpClient.get<OutagesResponse>(url)
      .subscribe({
        next: (data: OutagesResponse) => {
          if (data && data !== null && data.outages) {
            this.allOutages = [];
            data.outages.forEach(out => {
              this.allOutages.push(new GroundOutage(out));
            })
          }
        },
        error: err => {
          console.log(err)
        }
      });
  }

  public getOutage(id: string): Observable<OutageResponse> {
    const url = `/api/v2/metrics/outage/${id}`;
    return this.httpClient.get<OutageResponse>(url);
  }

  public getOutagesForWeek(outdate: Date): Observable<OutagesResponse> {
    const url = `/api/v2/metrics/outage/byweek/${this.getDateString(outdate)}`
    return this.httpClient.get<OutagesResponse>(url)
  }

  public getOutagesForPeriod(sDate: Date, eDate: Date): 
    Observable<OutagesResponse> {
    const url = `/api/v2/metrics/outage/byperiod/`
      + `${this.getDateString(sDate)}/${this.getDateString(eDate)}`;
    return this.httpClient.get<OutagesResponse>(url)
  }

  private getDateString(date: Date): string {
    let outageDate = `${date.getFullYear()}-`;
    if (date.getMonth() + 1 < 10) {
      outageDate += "0";
    }
    outageDate += `${date.getMonth() + 1}-`;
    if (date.getDate() < 10) {
      outageDate += "0";
    }
    outageDate += `${date.getDate()}`
    return outageDate;
  }

  public createOutage(system: string, enclave: string, outagedate: Date)
    : Observable<OutageResponse> {
    const newOutage: IGroundOutage = {
      groundSystem: system,
      classification: enclave,
      outageDate: new Date(outagedate),
      outageNumber: 0,
      outageMinutes: 0,
      missionOutage: false,
      subSystem: '',
      referenceId: '',
      majorSystem: '',
      problem: '',
      fixAction: '',
    };

    const outDate = new Date(outagedate);
    const reqDate = new Date(Date.UTC(outDate.getFullYear(), outDate.getMonth(),
      outDate.getDate()));
    let outNum = 0;
    this.allOutages.forEach(gndOut => {
      const gDate = new Date(gndOut.outageDate);
      if (gndOut.groundSystem === system && gndOut.classification === enclave
        && gDate.getDate() === reqDate.getTime()) {
          if (gndOut.outageNumber > outNum) {
            outNum = gndOut.outageNumber;
          }
        }
    });
    newOutage.outageNumber = outNum + 1;
    const url = '/api/v2/metrics/outage/';
    return this.httpClient.post<OutageResponse>(url, newOutage);
  }

  updateOutage(id: string, field: string, value: string): Observable<OutageResponse> {
    const url = '/api/v2/metrics/outage';
    const data: UpdateRequest = {
      id: id,
      field: field,
      value: value
    };
    return this.httpClient.put<OutageResponse>(url, data);
  }

  deleteOutage(id: string): Observable<OutageResponse> {
    const url = `/api/v2/metrics/outage/${id}`;
    return this.httpClient.delete<OutageResponse>(url);
  }
}
