import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSummaryComponent } from './modal-summary.component';

describe('ModalSummaryComponent', () => {
  let component: ModalSummaryComponent;
  let fixture: ComponentFixture<ModalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
