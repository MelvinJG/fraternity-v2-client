import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {

  userManual: string = '../../../../assets/documents/Manual de Usuario v2.pdf';

  constructor(
    public modalRef: MdbModalRef<HelpComponent>,
    private router: Router
  ) {}

  openPDF(event: Event) {
    event.preventDefault();
    // Cerrar el modal
    this.modalRef.close();
    // Navegar al componente PDF viewer que mantiene el favicon
    this.router.navigate(['/pdf-viewer']);
  }
}
