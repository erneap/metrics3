import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsDayMissionSensorComponent } from './reviews-day-mission-sensor.component';

describe('ReviewsDayMissionSensorComponent', () => {
  let component: ReviewsDayMissionSensorComponent;
  let fixture: ComponentFixture<ReviewsDayMissionSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsDayMissionSensorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsDayMissionSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
