import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsSensorsComponent } from './missions-sensors.component';

describe('MissionsSensorsComponent', () => {
  let component: MissionsSensorsComponent;
  let fixture: ComponentFixture<MissionsSensorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsSensorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsSensorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
