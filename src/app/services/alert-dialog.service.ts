import { ApplicationRef, EnvironmentInjector, Injectable, createComponent } from '@angular/core';
import { AlertDialogComponent, AlertDialogVariant } from '../components/ui/alert-dialog/alert-dialog.component';

export interface AlertDialogOptions {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: AlertDialogVariant;
}

@Injectable({ providedIn: 'root' })
export class AlertDialogService {
    constructor(
        private appRef: ApplicationRef,
        private injector: EnvironmentInjector
    ) { }

    confirm(options: AlertDialogOptions): Promise<boolean> {
        return new Promise((resolve) => {
            const componentRef = createComponent(AlertDialogComponent, {
                environmentInjector: this.injector
            });

            const instance = componentRef.instance;
            instance.title = options.title;
            instance.description = options.description;
            instance.confirmLabel = options.confirmLabel ?? 'Confirmar';
            instance.cancelLabel = options.cancelLabel ?? 'Cancelar';
            instance.variant = options.variant ?? 'default';

            const hostElement = componentRef.location.nativeElement as HTMLElement;
            document.body.appendChild(hostElement);
            this.appRef.attachView(componentRef.hostView);

            const cleanup = (result: boolean) => {
                confirmSub.unsubscribe();
                cancelSub.unsubscribe();
                this.appRef.detachView(componentRef.hostView);
                componentRef.destroy();
                hostElement.remove();
                resolve(result);
            };

            const confirmSub = instance.confirmed.subscribe(() => cleanup(true));
            const cancelSub = instance.cancelled.subscribe(() => cleanup(false));

            instance.isOpen = true;
            componentRef.changeDetectorRef.detectChanges();
        });
    }
}
