import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedTaskComponent } from './approved-task.component';

describe('ApprovedTaskComponent', () => {
  let component: ApprovedTaskComponent;
  let fixture: ComponentFixture<ApprovedTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
