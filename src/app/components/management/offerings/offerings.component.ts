import { Component } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-offerings',
    imports: [MdbFormsModule, CommonModule],
    templateUrl: './offerings.component.html',
    styleUrl: './offerings.component.scss'
})
export class OfferingsComponent { }
