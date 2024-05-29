import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsDayMissionSensorsComponent } from './reviews-day-mission-sensors.component';

describe('ReviewsDayMissionSensorsComponent', () => {
  let component: ReviewsDayMissionSensorsComponent;
  let fixture: ComponentFixture<ReviewsDayMissionSensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsDayMissionSensorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsDayMissionSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
