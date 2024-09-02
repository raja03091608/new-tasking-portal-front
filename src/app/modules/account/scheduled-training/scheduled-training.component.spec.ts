import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledTrainingComponent } from './scheduled-training.component';

describe('ScheduledTrainingComponent', () => {
  let component: ScheduledTrainingComponent;
  let fixture: ComponentFixture<ScheduledTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledTrainingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
