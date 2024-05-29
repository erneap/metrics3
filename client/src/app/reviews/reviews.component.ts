import { Component } from '@angular/core';
import { ReviewDay } from '../models/metrics/reviewDay';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AppStateService } from '../services/app-state.service';
import { MissionService } from '../services/mission.service';
import { DialogService } from '../services/dialog-service.service';
import { MissionsResponse } from '../models/web/missionsWeb';
import { Mission } from '../models/metrics/mission';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  days: ReviewDay[] = [];
  reviewForm: FormGroup;
  width: number = 700;

  constructor(
    protected authService: AuthService,
    protected appState: AppStateService,
    protected msnService: MissionService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    let end = new Date();
    end = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));
    const start = new Date(end.getTime() - (7 * 24 * 3600000));
    this.reviewForm = this.fb.group({
      start: [start, [Validators.required]],
      end: [end, [Validators.required]],
    });
    this.setMissionDays('');
    this.width = this.appState.viewWidth - 20;
    if (this.width > 700) {
      this.width = 700;
    }
  }

  setMissionDays(field: string) {
    let start = new Date(this.reviewForm.value.start);
    let end = new Date(this.reviewForm.value.end);
    if (end.getTime() < start.getTime()) {
      if (field.toLowerCase() === 'start') {
        end = new Date(start);
        this.reviewForm.controls['end'].setValue(end);
      } else {
        start = new Date(end);
        this.reviewForm.controls['start'].setValue(start);
      }
    }
    this.dialogService.showSpinner();
    this.msnService.getMissionsByDates(start, end).subscribe({
      next: (data: MissionsResponse) => {
        this.dialogService.closeSpinner();
        this.days = [];
        if (data && data !== null && data.missions) {
          let startDate = new Date(start);
          while (startDate.getTime() <= end.getTime()) {
            const tEnd = new Date(startDate.getTime() + (24 * 3600000));
            const day: ReviewDay = new ReviewDay();
            day.day = new Date(startDate);
            day.missions = [];
            data.missions.forEach(msn => {
              msn = new Mission(msn);
              if (msn.missionDate.getTime() >= startDate.getTime() 
                && msn.missionDate.getTime() < tEnd.getTime()) {
                day.missions.push(new Mission(msn))
              }
            });
            this.days.push(day);
            startDate = new Date(startDate.getTime() + (24 * 3600000));
          }
        }
        this.days.sort((a,b) => a.compareTo(b));
      },
      error: (err: MissionsResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    });
  }
}
