import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutagesListItemComponent } from './outages-list-item.component';

describe('OutagesListItemComponent', () => {
  let component: OutagesListItemComponent;
  let fixture: ComponentFixture<OutagesListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutagesListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutagesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
