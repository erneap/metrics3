import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionDeleteDialogComponent } from './mission-delete-dialog.component';

describe('MissionDeleteDialogComponent', () => {
  let component: MissionDeleteDialogComponent;
  let fixture: ComponentFixture<MissionDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionDeleteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
