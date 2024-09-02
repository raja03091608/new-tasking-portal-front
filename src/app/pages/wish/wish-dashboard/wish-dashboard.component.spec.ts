import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishDashboardComponent } from './wish-dashboard.component';

describe('WishDashboardComponent', () => {
  let component: WishDashboardComponent;
  let fixture: ComponentFixture<WishDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
