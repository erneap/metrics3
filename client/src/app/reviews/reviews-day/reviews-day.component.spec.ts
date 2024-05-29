import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsDayComponent } from './reviews-day.component';

describe('ReviewsDayComponent', () => {
  let component: ReviewsDayComponent;
  let fixture: ComponentFixture<ReviewsDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
