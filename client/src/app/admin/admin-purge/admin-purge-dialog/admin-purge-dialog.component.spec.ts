import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPurgeDialogComponent } from './admin-purge-dialog.component';

describe('AdminPurgeDialogComponent', () => {
  let component: AdminPurgeDialogComponent;
  let fixture: ComponentFixture<AdminPurgeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPurgeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPurgeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
