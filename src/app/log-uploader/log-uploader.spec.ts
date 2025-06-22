import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogUploader } from './log-uploader';

describe('LogUploader', () => {
  let component: LogUploader;
  let fixture: ComponentFixture<LogUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogUploader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
