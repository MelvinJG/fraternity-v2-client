import { Component } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
import { AlertDialogService } from '../../../services/alert-dialog.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SpinnerService } from '../../../services/spinner.service';
import { OfferingService } from '../../../services/offering.service';
import { toast } from 'ngx-sonner';
import { Constants } from '../../../utils/Constants';

interface KpiData {
    cantidad_ofrendas: number,
    total_recaudado: number,
    ofrendas_esta_semana: number,
    recaudado_esta_semana: number
}

@Component({
    selector: 'app-offerings',
    imports: [MdbFormsModule, CommonModule],
    templateUrl: './offerings.component.html',
    styleUrl: './offerings.component.scss'
})
export class OfferingsComponent { 
    loadData: any = {
        records: [],
        pagination: {
            hasPreviousPage: false,
            hasNextPage: false,
            previousPage: null,
            nextPage: null,
            pages: []
        }
    };
    searchType: string = 'nombre';
    nameSearch: string = '';
    nameValue: string = '';
    isSearching: boolean = false;
    currentPage: number = 1;
    visiblePages: (number | '...')[] = [];
    concept_offering: string = Constants.CONCEPT_OFFERING;
    kpiData: KpiData = {
        cantidad_ofrendas: 0,
        total_recaudado: 0,
        ofrendas_esta_semana: 0,
        recaudado_esta_semana: 0
    };
    loadingKPIs: boolean = false;

    constructor(
        private spinnerService: SpinnerService,
        private offeringService: OfferingService,
        private modalService: MdbModalService,
        private authService: UserAuthService,
        private alertDialogService: AlertDialogService
    ) { }

    ngOnInit(): void {
        this.loadAllOfferings();
        this.loadKpiData();
    }

    loadAllOfferings() {
        this.spinnerService.show();
        this.offeringService.getOfferings(1).subscribe({
            next: (res: any) => {
                this.loadData = res.data;
                this.refreshVisiblePages(1);
                this.spinnerService.hide();
            },
            error: (err: any) => {
                this.spinnerService.hide();
                if (err.status === 0) {
                    toast.error(err.message || "Error interno del servidor");
                } else if (err.status === 500) {
                    toast.error(err.error.message || "Error interno del servidor");
                } else {
                    toast.info(err.error.message);
                }
            }
        });
    }

    delete(offeringId: string) {
        this.alertDialogService.confirm({
            title: '¿Eliminar Ofrenda?',
            description: 'Esta acción eliminará la ofrenda de manera permanente.',
            confirmLabel: 'Si, Eliminar!',
            cancelLabel: 'Cancelar',
            variant: 'danger'
        }).then((confirmed) => {
            if (confirmed) {
                this.spinnerService.show();
                const deletedUser = { deletedBy: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
                this.offeringService.deleteOffering(offeringId, deletedUser).subscribe({
                    next: (_res: any) => {
                        this.spinnerService.hide();
                        toast.success('Ofrenda eliminada exitosamente.');
                        this.ngOnInit();
                    },
                    error: (err: any) => {
                        this.spinnerService.hide();
                        err.status === 500 || err.status === 0 ? toast.error(err.error.message || err.message || "Error interno del servidor") : toast.info(err.error.message);
                    }
                });
            }
        });
    }

    print(data: any) {
        // Implement print functionality here
    }

    loadKpiData(): void {
        this.offeringService.getKpis().subscribe({
            next: (data: any) => {
                this.kpiData = data.data[0];
                this.kpiData.cantidad_ofrendas = Number(this.kpiData.cantidad_ofrendas);
                this.kpiData.total_recaudado = Number(this.kpiData.total_recaudado);
                this.kpiData.ofrendas_esta_semana = Number(this.kpiData.ofrendas_esta_semana);
                this.kpiData.recaudado_esta_semana = Number(this.kpiData.recaudado_esta_semana);
                this.loadingKPIs = true;
            },
            error: (error) => {
                console.error('Error loading KPIs:', error);
                this.loadingKPIs = false;
            }
        });
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        }).format(value);
    }

    private refreshVisiblePages(fallbackPage: number): void {
        const pagination = this.loadData?.pagination || {};
        const totalPages = typeof pagination.totalPages === 'number'
        ? pagination.totalPages
        : Array.isArray(pagination.pages)
            ? pagination.pages.length
            : 0;

        const current = typeof pagination.currentPage === 'number'
        ? pagination.currentPage
        : fallbackPage;

        this.currentPage = current;
        this.visiblePages = this.buildVisiblePages(current, totalPages);
    }

    private buildVisiblePages(currentPage: number, totalPages: number): (number | '...')[] {
        if (!totalPages || totalPages <= 0) {
        return [];
        }

        if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 3) {
        return [1, 2, 3, 4, '...', totalPages];
        }

        if (currentPage >= totalPages - 2) {
        return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }

    changePage(page: number) {
        if (!page || page === this.currentPage) {
            return;
        }

        this.spinnerService.show();

        if(this.isSearching) {
            // const searchObservable = this.searchType === 'dpi'
            //     ? this.receiptsService.getInscriptionsByDPI(this.dpiSearch, page)
            //     : this.searchType === 'codigo'
            //     ? this.receiptsService.getInscriptionsByCode(this.codeSearch, page)
            //     : this.receiptsService.getInscriptionsByName(this.nameSearch, page);

            // searchObservable.subscribe({
            //     next: (res: any) => {
            //     this.loadData = res.data;
            //     this.isSearching = true;
            //     this.refreshVisiblePages(page);
            //     this.spinnerService.hide();
            //     },
            //     error: (err: any) => {
            //     this.isSearching = false;
            //     this.spinnerService.hide();
            //     err.status === 500 || err.status === 0 ? toast.error(err.error.message || err.message || "Error interno del servidor") : toast.info(err.error.message);
            //     }
            // });
        } else {
            this.isSearching = false;
            this.offeringService.getOfferings(page).subscribe({
                next: (res: any) => {
                this.loadData = res.data;
                this.refreshVisiblePages(page);
                this.spinnerService.hide();
                },
                error: (err: any) => {
                this.spinnerService.hide();
                err.status === 500 || err.status === 0 ? toast.error(err.error.message || err.message || "Error interno del servidor") : toast.info(err.error.message);
                }
            });
        }
    }
}
