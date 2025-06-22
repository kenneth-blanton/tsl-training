import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thermoforming101 } from './thermoforming101';

describe('Thermoforming101', () => {
  let component: Thermoforming101;
  let fixture: ComponentFixture<Thermoforming101>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Thermoforming101]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Thermoforming101);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
