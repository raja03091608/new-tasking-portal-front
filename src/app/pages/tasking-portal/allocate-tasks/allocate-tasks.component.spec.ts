import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateTasksComponent } from './allocate-tasks.component';

describe('AllocateTasksComponent', () => {
  let component: AllocateTasksComponent;
  let fixture: ComponentFixture<AllocateTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
