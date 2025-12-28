import { Component } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { RegisterComponent } from '../../register/register.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  isUpdate: boolean = false;

  constructor(public modalRef: MdbModalRef<ModalComponent>) {}
}
