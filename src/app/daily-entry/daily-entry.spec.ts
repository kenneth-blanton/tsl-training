import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyEntry } from './daily-entry';

describe('DailyEntry', () => {
  let component: DailyEntry;
  let fixture: ComponentFixture<DailyEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyEntry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
