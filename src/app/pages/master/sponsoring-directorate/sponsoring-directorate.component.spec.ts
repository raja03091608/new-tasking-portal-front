import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoringDirectorateComponent } from './sponsoring-directorate.component';

describe('SponsoringDirectorateComponent', () => {
  let component: SponsoringDirectorateComponent;
  let fixture: ComponentFixture<SponsoringDirectorateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsoringDirectorateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsoringDirectorateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
