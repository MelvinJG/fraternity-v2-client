import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { toast } from 'ngx-sonner';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OfferingService } from '../../../services/offering.service';
import { SpinnerService } from '../../../services/spinner.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { AlertDialogService } from '../../../services/alert-dialog.service';

import { OfferingsComponent } from './offerings.component';

describe('OfferingsComponent', () => {
  let component: OfferingsComponent;
  let fixture: ComponentFixture<OfferingsComponent>;
  let offeringService: jasmine.SpyObj<OfferingService>;
  let spinnerService: jasmine.SpyObj<SpinnerService>;
  let authService: jasmine.SpyObj<UserAuthService>;
  let offeringForm: NgForm;
  const emptyResponse = {
    data: { records: [], pagination: { currentPage: 1, totalPages: 0 } }
  };

  beforeEach(async () => {
    offeringService = jasmine.createSpyObj<OfferingService>('OfferingService', [
      'getOfferings', 'getOfferingByName', 'getKpis', 'create'
    ]);
    spinnerService = jasmine.createSpyObj<SpinnerService>('SpinnerService', ['show', 'hide']);
    authService = jasmine.createSpyObj<UserAuthService>('UserAuthService', ['getUserInfo']);
    authService.getUserInfo.and.returnValue(null);
    offeringService.create.and.returnValue(of({}));
    offeringService.getOfferings.and.returnValue(of(emptyResponse));
    offeringService.getOfferingByName.and.returnValue(of(emptyResponse));
    offeringService.getKpis.and.returnValue(of({
      data: { cantidad_ofrendas: 0, total_recaudado: 0, ofrendas_esta_semana: 0, recaudado_esta_semana: 0 }
    }));
    await TestBed.configureTestingModule({
      imports: [OfferingsComponent],
      providers: [
        { provide: OfferingService, useValue: offeringService },
        { provide: SpinnerService, useValue: spinnerService },
        { provide: MdbModalService, useValue: {} },
        { provide: UserAuthService, useValue: authService },
        { provide: AlertDialogService, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    offeringForm = fixture.debugElement.query(By.css('form.offering-form')).injector.get(NgForm);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searches the trimmed name when the form is submitted and shows the empty search state', () => {
    const element: HTMLElement = fixture.nativeElement;
    const input = element.querySelector<HTMLInputElement>('#offeringSearchName')!;
    input.value = '  Maria  ';
    input.dispatchEvent(new Event('input'));
    element.querySelector<HTMLFormElement>('form[role="search"]')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(offeringService.getOfferingByName).toHaveBeenCalledWith('Maria', 1);
    expect(element.textContent).toContain('No se encontraron ofrendas para esta búsqueda.');
  });

  it('keeps the submitted name when paging even if the input has been edited', () => {
    component.nameValue = 'Maria';
    component.onSearch();
    component.nameValue = 'Ana';
    component.changePage(2);

    expect(offeringService.getOfferingByName).toHaveBeenCalledWith('Maria', 2);
  });

  it('restores the complete list on page one when an empty search is submitted', () => {
    component.nameValue = 'Maria';
    component.onSearch();
    component.nameValue = '   ';
    component.onSearch();
    component.changePage(2);

    expect(component.isSearching).toBeFalse();
    expect(offeringService.getOfferings).toHaveBeenCalledWith(1);
    expect(offeringService.getOfferings).toHaveBeenCalledWith(2);
  });

  it('keeps the previous filter and releases loading after a failed search', () => {
    component.nameValue = 'Maria';
    component.onSearch();
    const request = new Subject<object>();
    offeringService.getOfferingByName.and.returnValue(request);
    const errorToast = spyOn(toast, 'error');
    component.nameValue = 'Ana';
    component.onSearch();
    component.changePage(2);
    expect(offeringService.getOfferingByName).not.toHaveBeenCalledWith('Maria', 2);

    request.error(new HttpErrorResponse({ status: 500, error: { message: 'Error de búsqueda' } }));

    expect(component.nameSearch).toBe('Maria');
    expect(component.isSearching).toBeTrue();
    expect(component.loadingOfferings).toBeFalse();
    expect(spinnerService.hide).toHaveBeenCalled();
    expect(errorToast).toHaveBeenCalledWith('Error de búsqueda');
  });

  it('submits the API payload with a UUID v4 and resets the form and refreshes data on success', async () => {
    authService.getUserInfo.and.returnValue({
      dpi: '777', fullName: 'Test', email: '', idFraternity: 1,
      idPermission: 1, fraternityName: '', permissionDescription: ''
    });
    const successToast = spyOn(toast, 'success');
    const element: HTMLElement = fixture.nativeElement;
    const nameInput = element.querySelector<HTMLInputElement>('#offeringName')!;
    const amountInput = element.querySelector<HTMLInputElement>('#offeringAmount')!;
    nameInput.value = '  Maria  ';
    nameInput.dispatchEvent(new Event('input'));
    amountInput.value = '100';
    amountInput.dispatchEvent(new Event('input'));
    element.querySelector<HTMLFormElement>('form.offering-form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    const payload = offeringService.create.calls.mostRecent().args[0];
    expect(payload).toEqual({
      receiptSeries: 'OFR', name: 'Maria', amount: 100, createdBy: '777',
      idempotencyKey: jasmine.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    });
    expect(nameInput.value).toBe('');
    expect(amountInput.value).toBe('');
    expect(component.savingOffering).toBeFalse();
    expect(successToast).toHaveBeenCalledWith('Ofrenda creada exitosamente.');
    expect(offeringService.getOfferings).toHaveBeenCalledTimes(2);
    expect(offeringService.getKpis).toHaveBeenCalledTimes(2);
  });

  it('blocks duplicate submissions and reuses the same payload and key after an uncertain failure', () => {
    offeringForm.setValue({ name: 'Maria', amount: 100 });
    const request = new Subject<object>();
    offeringService.create.and.returnValue(request);
    spyOn(toast, 'error');
    component.onCreate(offeringForm);
    const originalPayload = offeringService.create.calls.mostRecent().args[0];
    component.onCreate(offeringForm);
    expect(offeringService.create).toHaveBeenCalledTimes(1);

    request.error(new HttpErrorResponse({ status: 0 }));
    expect(component.savingOffering).toBeFalse();
    expect(component.offeringName).toBe('Maria');
    expect(component.offeringAmount).toBe(100);
    offeringService.create.and.returnValue(of({}));
    component.onCreate(offeringForm);

    expect(offeringService.create).toHaveBeenCalledTimes(2);
    expect(offeringService.create.calls.mostRecent().args[0]).toEqual(originalPayload);
    expect(originalPayload.createdBy).toBe('ERR_DPI_APP');
  });

  it('generates a new key for another offering after a successful creation', () => {
    offeringForm.setValue({ name: 'Maria', amount: 100 });
    component.onCreate(offeringForm);
    const firstKey = offeringService.create.calls.mostRecent().args[0].idempotencyKey;
    offeringForm.setValue({ name: 'Maria', amount: 100 });
    component.onCreate(offeringForm);

    expect(offeringService.create.calls.mostRecent().args[0].idempotencyKey).not.toBe(firstKey);
  });

  it('generates a different key when the payload changes after failure', () => {
    offeringForm.setValue({ name: 'Maria', amount: 100 });
    const request = new Subject<object>();
    offeringService.create.and.returnValue(request);
    spyOn(toast, 'error');
    component.onCreate(offeringForm);
    const firstKey = offeringService.create.calls.mostRecent().args[0].idempotencyKey;
    request.error(new HttpErrorResponse({ status: 500 }));
    offeringForm.setValue({ name: 'Maria', amount: 200 });
    offeringService.create.and.returnValue(of({}));
    component.onCreate(offeringForm);

    expect(offeringService.create.calls.mostRecent().args[0].idempotencyKey).not.toBe(firstKey);
    expect(offeringService.create.calls.mostRecent().args[0].amount).toBe(200);
  });

  it('rejects blank names and missing, non-positive or non-finite amounts without sending a request', () => {
    const warningToast = spyOn(toast, 'warning');
    for (const values of [
      { name: '   ', amount: 100 }, { name: 'Maria', amount: null },
      { name: 'Maria', amount: 0 }, { name: 'Maria', amount: -1 },
      { name: 'Maria', amount: Infinity }, { name: 'Maria', amount: NaN }
    ]) {
      offeringForm.setValue(values);
      component.onCreate(offeringForm);
    }

    expect(offeringService.create).not.toHaveBeenCalled();
    expect(warningToast).toHaveBeenCalledTimes(6);
  });
});
