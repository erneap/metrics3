import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsSensorsCommComponent } from './missions-sensors-comm.component';

describe('MissionsSensorsCommComponent', () => {
  let component: MissionsSensorsCommComponent;
  let fixture: ComponentFixture<MissionsSensorsCommComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsSensorsCommComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsSensorsCommComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
