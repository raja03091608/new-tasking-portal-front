import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedsComponent } from './featureds.component';

describe('FeaturedsComponent', () => {
  let component: FeaturedsComponent;
  let fixture: ComponentFixture<FeaturedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
