import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../services/spinner.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { toast } from 'ngx-sonner';
import { AlertDialogService } from '../../../services/alert-dialog.service';

interface IUsersList {
  dpi: string;
  fullName: string;
  email: string;
  permissionDescription: string;
  created_at: string;
  idState: number;
}

@Component({
    selector: 'app-list-users',
    imports: [CommonModule],
    templateUrl: './list-users.component.html',
    styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {

  usersList: IUsersList[] = [];

  constructor(
      private router: Router,
      private spinnerService: SpinnerService,
      private authService: UserAuthService,
      private alertDialogService: AlertDialogService
    ) {}

  ngOnInit(): void {
    this.spinnerService.show();
    const USER_DATA = this.authService.getUserInfo();
    if (USER_DATA?.idPermission !== 1) { // Solo el admin pueden listar usuarios
      this.spinnerService.hide();
      toast.warning('No tienes permisos para listar usuarios.');
      void this.router.navigate(['/home']);
      return;
    }
    this.authService.listUsers().subscribe({
      next: (res: any) => {
        this.usersList = res.data.map((user: any) => ({ 
          dpi: user.dpi,
          fullName: user.fullName,
          email: user.email,
          permissionDescription: user.permissionDescription,
          created_at: new Date(user.created_at),
          idState: user.idState
        }));
        this.spinnerService.hide();
      },
      error: (err: any) => {
        this.spinnerService.hide();
        if (err.status === 0) {
          toast.error(err.message || "Error interno del servidor");
        } else if (err.status === 500) {
          toast.error(err.error.message || "Error interno del servidor");
        } else if (err.status === 404) {
          this.usersList = [];
        } else {
          toast.info(err.error.message);
        }
      }
    });
  }

  editUser(dpi: string, isState: number){
    if(isState === 1){
      this.alertDialogService.confirm({
        title: '¿Inactivar Usuario?',
        description: 'Esta acción inactivará al usuario de manera temporal.',
        confirmLabel: 'Inactivar',
        cancelLabel: 'Cancelar',
        variant: 'danger'
      }).then((confirmed) => {
        if (confirmed) {
          this.spinnerService.show();
          const deletedUser = { idState: 2, deleted_by: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
          this.authService.editDeleteUser(dpi, deletedUser).subscribe({
            next: (res: any) => {
              this.spinnerService.hide();
              toast.success('Usuario inactivado exitosamente.');
              this.ngOnInit();
            },
            error: (err: any) => {
              this.spinnerService.hide();
              err.status === 500 || err.status === 0 ? toast.error(err.error.message || err.message || "Error interno del servidor") : toast.info(err.error.message);
            }
          });
        }
      });
    } else {
      this.alertDialogService.confirm({
        title: '¿Reactivar Usuario?',
        description: 'Esta acción reactivará al usuario de manera permanente.',
        confirmLabel: 'Reactivar',
        cancelLabel: 'Cancelar',
        variant: 'info'
      }).then((confirmed) => {
        if (confirmed) {
          this.spinnerService.show();
          const updatedUser = { idState: 1, updated_by: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
          this.authService.editDeleteUser(dpi, updatedUser).subscribe({
            next: (res: any) => {
              this.spinnerService.hide();
              toast.success('Usuario reactivado exitosamente.');
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
  }
}
