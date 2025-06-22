import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sops } from './sops';

describe('Sops', () => {
  let component: Sops;
  let fixture: ComponentFixture<Sops>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sops]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sops);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
