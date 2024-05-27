import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionNewDialogComponent } from './mission-new-dialog.component';

describe('MissionNewDialogComponent', () => {
  let component: MissionNewDialogComponent;
  let fixture: ComponentFixture<MissionNewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionNewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionNewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
