import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsSensorsImintComponent } from './missions-sensors-imint.component';

describe('MissionsSensorsImintComponent', () => {
  let component: MissionsSensorsImintComponent;
  let fixture: ComponentFixture<MissionsSensorsImintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsSensorsImintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsSensorsImintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
