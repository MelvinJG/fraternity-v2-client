import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpinnerService } from '../../../services/spinner.service';
import { UserAuthService } from '../../../services/user-auth.service';
import Swal from 'sweetalert2';

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
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {

  usersList: IUsersList[] = [];

  constructor(
      private router: Router,
      private spinnerService: SpinnerService,
      private authService: UserAuthService
    ) {}

  ngOnInit(): void {
    this.spinnerService.show();
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
        console.log("USERS LIST -> ",this.usersList);
        this.spinnerService.hide();
      },
      error: (err: any) => {
        this.spinnerService.hide();
        Swal.fire({
          icon: err.status === 500 ? 'error' : 'info',
          title: 'Oops...',
          text: err.error.message
        })
      }
    });
    this.spinnerService.hide();
  }

  editUser(dpi: string, isState: number){
    if(isState === 1){
      Swal.fire({
        title: 'Inactivar Usuario',
        text: "¿Quieres inactivar este usuario?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Si, Inactivar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinnerService.show();
          const deletedUser = { idState: 2, deleted_by: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
          this.authService.editDeleteUser(dpi, deletedUser).subscribe({
            next: (res: any) => {
              console.log("RESPONSE editDeleteUser -> ",res)
              this.spinnerService.hide();
              Swal.fire({
                icon: 'success',
                title: 'Usuario inactivo.',
                showConfirmButton: false,
                timer: 1200
              });
              this.ngOnInit();
            },
            error: (err: any) => {
              console.log("ERROR editDeleteUser -> ",err)
              this.spinnerService.hide();
              Swal.fire({
                icon: err.status === 500 ? 'error' : 'info',
                title: 'Oops...',
                text: err.error.message
              })
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Reactivar Usuario',
        text: "¿Quieres volver a activar este usuario?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Si, activar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinnerService.show();
          const updatedUser = { idState: 1, updated_by: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
          this.authService.editDeleteUser(dpi, updatedUser).subscribe({
            next: (res: any) => {
              console.log("RESPONSE editDeleteUser -> ",res)
              this.spinnerService.hide();
              Swal.fire({
                icon: 'success',
                title: 'Usuario activado.',
                showConfirmButton: false,
                timer: 1200
              });
              this.ngOnInit();
            },
            error: (err: any) => {
              console.log("ERROR editDeleteUser -> ",err)
              this.spinnerService.hide();
              Swal.fire({
                icon: err.status === 500 ? 'error' : 'info',
                title: 'Oops...',
                text: err.error.message
              })
            }
          });
        }
      });
    }
  }

  actDelUser(dpi: string, user: object){
    
  }
}
