import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPurgeComponent } from './admin-purge.component';

describe('AdminPurgeComponent', () => {
  let component: AdminPurgeComponent;
  let fixture: ComponentFixture<AdminPurgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPurgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPurgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
