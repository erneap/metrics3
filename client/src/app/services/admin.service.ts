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
    const pDate = new Date(Date.UTC(purgeDate.getUTCFullYear(), 
      purgeDate.getUTCMonth(), purgeDate.getUTCDate()));
    const url = `/metrics/api/v1/admin/missions/${this.dateString(pDate)}`;
    return this.httpClient.delete(url);
  }

  purgeOutages(purgeDate: Date): Observable<Object> {
    const pDate = new Date(Date.UTC(purgeDate.getUTCFullYear(), 
      purgeDate.getUTCMonth(), purgeDate.getUTCDate()));
    const url = `/metrics/api/v1/admin/outages/${this.dateString(pDate)}`;
    return this.httpClient.delete(url);
  }

  private dateString(msndate:Date): string {
    let sDate = `${msndate.getUTCFullYear()}-`;
    if (msndate.getUTCMonth() + 1 < 10) {
      sDate += "0";
    }
    sDate += `${msndate.getUTCMonth() + 1}-`;
    if (msndate.getUTCDate() < 10) {
      sDate += "0";
    }
    sDate += `${msndate.getUTCDate()}`;
    return sDate
  }
}
