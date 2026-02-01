import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelReportTurnsComponent } from './excel-report-turns.component';

describe('ExcelReportTurnsComponent', () => {
  let component: ExcelReportTurnsComponent;
  let fixture: ComponentFixture<ExcelReportTurnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelReportTurnsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelReportTurnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
