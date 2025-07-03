import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastRecipes } from './past-recipes';

describe('PastRecipes', () => {
  let component: PastRecipes;
  let fixture: ComponentFixture<PastRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
