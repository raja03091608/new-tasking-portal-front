import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledInterviewsComponent } from './scheduled-interviews.component';

describe('ScheduledInterviewsComponent', () => {
  let component: ScheduledInterviewsComponent;
  let fixture: ComponentFixture<ScheduledInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledInterviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
