import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends CacheService {

  constructor(
    protected httpClient: HttpClient
  ) {
    super();
  }

  purgeMissions(purgeDate: Date): Observable<Object> {
    const pDate = new Date(Date.UTC(purgeDate.getFullYear(), 
      purgeDate.getMonth(), purgeDate.getDate()));
    const url = `/metrics/api/v1/admin/missions/${this.dateString(pDate)}`;
    return this.httpClient.delete(url);
  }

  purgeOutages(purgeDate: Date): Observable<Object> {
    const pDate = new Date(Date.UTC(purgeDate.getFullYear(), 
      purgeDate.getMonth(), purgeDate.getDate()));
    const url = `/metrics/api/v1/admin/outages/${this.dateString(pDate)}`;
    return this.httpClient.delete(url);
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
