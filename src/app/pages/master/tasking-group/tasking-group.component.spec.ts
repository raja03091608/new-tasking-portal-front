import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskingGroupComponent } from './tasking-group.component';

describe('TaskingGroupComponent', () => {
  let component: TaskingGroupComponent;
  let fixture: ComponentFixture<TaskingGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskingGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskingGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
