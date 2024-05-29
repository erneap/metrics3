import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsDayMissionComponent } from './reviews-day-mission.component';

describe('ReviewsDayMissionComponent', () => {
  let component: ReviewsDayMissionComponent;
  let fixture: ComponentFixture<ReviewsDayMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsDayMissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsDayMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
