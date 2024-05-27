import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsChangeSortieDialogComponent } from './missions-change-sortie-dialog.component';

describe('MissionsChangeSortieDialogComponent', () => {
  let component: MissionsChangeSortieDialogComponent;
  let fixture: ComponentFixture<MissionsChangeSortieDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsChangeSortieDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsChangeSortieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
