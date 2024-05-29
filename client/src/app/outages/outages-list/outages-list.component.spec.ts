import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutagesListComponent } from './outages-list.component';

describe('OutagesListComponent', () => {
  let component: OutagesListComponent;
  let fixture: ComponentFixture<OutagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutagesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
