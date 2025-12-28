import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { UserAuthService } from '../../services/user-auth.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbRippleModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {
  isSidenavOpen = false;
  isNotificationDropdownOpen = false;
  isProfileDropdownOpen = false;
  notificationCount = 3;
  userName = '';
  userEmail = '';
  userRole = '';
  isLoggedIn: boolean = false;
  isUsuariosDropdownOpen = false;
  isProductosDropdownOpen = false;

  constructor(
      private router: Router,
      private spinnerService: SpinnerService,
      private authService: UserAuthService
    ) {}

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    
    // Prevenir scroll del body cuando el sidenav está abierto en móvil
    if (this.isSidenavOpen && window.innerWidth < 992) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeSidenav() {
    this.isSidenavOpen = false;
    document.body.style.overflow = ''; // Restaurar scroll
  }

  // Cerrar sidenav al hacer resize si estamos en desktop
  onResize() {
    if (window.innerWidth >= 992 && this.isSidenavOpen) {
      this.closeSidenav();
    }
  }

  // Listener para la tecla Escape
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isSidenavOpen) {
      this.closeSidenav();
    }
  }

  ngOnInit() {
    // Agregar listeners para eventos
    window.addEventListener('resize', () => this.onResize());
    document.addEventListener('keydown', (event) => this.onKeydown(event));
    document.addEventListener('click', (event) => this.onDocumentClick(event));

    // Nuevo codigo
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      console.log('Estado de login actualizado:', status);

      const USER_DATA = this.authService.getUserInfo();
      this.userName = USER_DATA?.fullName || '';
      this.userEmail = USER_DATA?.fraternityName || '';
      this.userRole = USER_DATA?.permissionDescription || '';
    });
  }

  // Métodos para las acciones del navbar
  onProfileClick() {
    console.log('Ir al perfil');
    // Aquí puedes agregar la navegación al perfil
  }

  onSettingsClick() {
    console.log('Ir a configuración');
    // Aquí puedes agregar la navegación a configuración
  }

  onLogoutClick() {
    console.log('Cerrar sesión');
    this.spinnerService.show();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onNotificationClick(notification: string) {
    console.log('Notificación clickeada:', notification);
    // Aquí puedes manejar el click en notificaciones
  }

  markAllNotificationsAsRead() {
    this.notificationCount = 0;
    console.log('Todas las notificaciones marcadas como leídas');
  }

  // Métodos para controlar los dropdowns
  toggleNotificationDropdown() {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    this.isProfileDropdownOpen = false; // Cerrar el otro dropdown
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    this.isNotificationDropdownOpen = false; // Cerrar el otro dropdown
  }

  closeAllDropdowns() {
    this.isNotificationDropdownOpen = false;
    this.isProfileDropdownOpen = false;
  }

  // Cerrar dropdowns al hacer clic fuera
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdownElements = document.querySelectorAll('.dropdown');
    
    let clickedInsideDropdown = false;
    dropdownElements.forEach(dropdown => {
      if (dropdown.contains(target)) {
        clickedInsideDropdown = true;
      }
    });

    if (!clickedInsideDropdown) {
      this.closeAllDropdowns();
    }
  }

  ngOnDestroy() {
    // Limpiar listeners y restaurar scroll
    document.body.style.overflow = '';
    window.removeEventListener('resize', () => this.onResize());
    document.removeEventListener('keydown', (event) => this.onKeydown(event));
    document.removeEventListener('click', (event) => this.onDocumentClick(event));
  }

  toggleUsuariosDropdown() {
    this.isUsuariosDropdownOpen = !this.isUsuariosDropdownOpen;
  }

  toggleProductosDropdown() {
    this.isProductosDropdownOpen = !this.isProductosDropdownOpen;
  }

  closeSidenavDropdowns() {
    this.isUsuariosDropdownOpen = false;
    this.isProductosDropdownOpen = false;
  }
}
