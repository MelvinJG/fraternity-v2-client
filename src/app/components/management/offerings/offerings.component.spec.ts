import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
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
  const emptyResponse = {
    data: { records: [], pagination: { currentPage: 1, totalPages: 0 } }
  };

  beforeEach(async () => {
    offeringService = jasmine.createSpyObj<OfferingService>('OfferingService', [
      'getOfferings', 'getOfferingByName', 'getKpis'
    ]);
    spinnerService = jasmine.createSpyObj<SpinnerService>('SpinnerService', ['show', 'hide']);
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
        { provide: UserAuthService, useValue: {} },
        { provide: AlertDialogService, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
});
