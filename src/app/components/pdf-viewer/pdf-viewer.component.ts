import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.scss'
})
export class PdfViewerComponent implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;
  pdfPath: string = '';

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Por defecto, carga el manual de usuario
    this.pdfPath = 'assets/documents/Manual de Usuario v2.pdf';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfPath);
  }
}
