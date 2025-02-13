import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridWishComponent } from './grid-wish.component';

describe('GridWishComponent', () => {
  let component: GridWishComponent;
  let fixture: ComponentFixture<GridWishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridWishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridWishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
