import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

export type AlertDialogVariant = 'danger' | 'default' | 'primary' | 'success';

@Component({
    selector: 'app-alert-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './alert-dialog.component.html',
    styleUrl: './alert-dialog.component.scss'
})
export class AlertDialogComponent implements OnChanges, OnDestroy {
    @Input() isOpen = false;
    @Input() title = '';
    @Input() description?: string;
    @Input() confirmLabel = 'Confirmar';
    @Input() cancelLabel = 'Cancelar';
    @Input() variant: AlertDialogVariant = 'default';

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen']) {
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
        }
    }

    ngOnDestroy(): void {
        document.body.style.overflow = '';
    }

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.isOpen) {
            this.onCancel();
        }
    }

    onCancel(): void {
        this.cancelled.emit();
    }

    onConfirm(): void {
        this.confirmed.emit();
    }
}
