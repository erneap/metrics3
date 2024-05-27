import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsSensorsXintComponent } from './missions-sensors-xint.component';

describe('MissionsSensorsXintComponent', () => {
  let component: MissionsSensorsXintComponent;
  let fixture: ComponentFixture<MissionsSensorsXintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsSensorsXintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsSensorsXintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
