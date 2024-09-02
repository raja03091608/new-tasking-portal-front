import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHomepageComponent } from './add-homepage.component';

describe('AddHomepageComponent', () => {
  let component: AddHomepageComponent;
  let fixture: ComponentFixture<AddHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
