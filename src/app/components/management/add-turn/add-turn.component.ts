import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../../services/spinner.service';
import { UserAuthService } from '../../../services/user-auth.service';
import Swal from 'sweetalert2';
import { TurnsService } from '../../../services/turns.service';
import { FormsModule } from '@angular/forms';

interface ITurns {
  id?: number;
  description: string;
  price: number | null;
  quantity: number | null;
  armNumber: number | null;
  sold?: number;
  idFraternity?: number;
  created_by?: string;
  updated_by?: string;
}

@Component({
  selector: 'app-add-turn',
  standalone: true,
  imports: [MdbFormsModule, CommonModule, FormsModule],
  templateUrl: './add-turn.component.html',
  styleUrl: './add-turn.component.scss'
})

export class AddTurnComponent implements OnInit {
  loadData: ITurns[] = [];
  turnData: ITurns = {
    description: '',
    price: null,
    quantity: null,
    armNumber: null,
    sold: 0,
    idFraternity: 0,
    created_by: ''
  };
  isEditing: boolean = false;
  editingId: number = 0;
  isAdminUser: boolean = false;

  constructor(
    private spinnerService: SpinnerService,
    private turnsService: TurnsService,
    private authService: UserAuthService
  ) { }

  ngOnInit(): void {
    this.spinnerService.show();
    const USER_DATA = this.authService.getUserInfo();
    if (USER_DATA?.idPermission === 1) { // Solo el admin pueden realizar acciones
      this.isAdminUser = true;
    }
    this.turnsService.getTurns().subscribe({
      next: (res: any) => {
        this.loadData = res.data.map((data: any) => ({
          id: data.id,
          description: data.description,
          price: data.price,
          quantity: data.quantity,
          armNumber: data.armNumber,
          sold: data.sold
        }));
        this.spinnerService.hide();
      },
      error: (err: any) => {
        this.spinnerService.hide();
        Swal.fire({
          position: "top-end",
          icon: err.status === 500 ? 'error' : 'info',
          title: err.error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

  onSubmit(){
    if(this.turnData.description === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor complete todos los campos.'
      });
    } else {
      this.spinnerService.show();
      if(!this.isEditing){ //CREAR
        this.turnData.created_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
        this.turnData.idFraternity = this.authService.getUserInfo()?.idFraternity || 777;
        this.turnsService.createTurn(this.turnData).subscribe({
          next: (res: any) => {
            this.spinnerService.hide();
            Swal.fire({
              icon: 'success',
              title: 'Turno creado.',
              showConfirmButton: false,
              timer: 1200
            });
            setTimeout(() => {
              window.location.reload();
            }, 1200);
            //this.router.navigate(['/user/list']);
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
      } else { //ACTUALIZAR
        // if ((this.turnData.sold ?? 0) > (this.turnData.quantity ?? 0)) {
        //   this.spinnerService.hide();
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'No se puede actualizar porque la cantidad vendida es mayor a la cantidad disponible.'
        //   })
        // } else {
          delete this.turnData.idFraternity;
          delete this.turnData.created_by;
          delete this.turnData.sold;
          delete this.turnData.id;
          this.turnData.updated_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
          this.turnsService.editDeletTurn(this.editingId,this.turnData).subscribe({
            next: (res: any) => {
              this.spinnerService.hide();
              Swal.fire({
                icon: 'success',
                title: 'Turno Actualizado.',
                showConfirmButton: false,
                timer: 1200
              });
              setTimeout(() => {
                window.location.reload();
              }, 1200);
              //this.router.navigate(['/user/list']);
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
        // }
      }
    }
  }

  onEditTurn(idTurn: number){
    this.isEditing = true;
    this.editingId = idTurn;
    const turnToEdit = this.loadData.find(turn => turn.id === idTurn);
    if (turnToEdit) {
      this.turnData = { ...turnToEdit, created_by: '', idFraternity: 777 }; //Eliminare estos datos para acutalizacion
    }
  }

  onDeleteTurn(idTurn: number){
    const turnToEdit = this.loadData.find(turn => turn.id === idTurn);
    if ((turnToEdit?.sold ?? 0) >= 1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede eliminar porque ya se vendio al menos un turno.'
      })
    } else {
      Swal.fire({
        title: 'Eliminar Turno',
        text: "¿Quieres eliminar este turno?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'gray',
        confirmButtonText: 'Si, Eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.spinnerService.show();
          const deletedUser = { idState: 2, deleted_by: this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP' };
          this.turnsService.editDeletTurn(idTurn, deletedUser).subscribe({
            next: (res: any) => {
              this.spinnerService.hide();
              Swal.fire({
                icon: 'success',
                title: 'Turno Eliminado.',
                showConfirmButton: false,
                timer: 1200
              });
              setTimeout(() => {
                //window.location.reload();
                this.ngOnInit();
              }, 1200);
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
        }
      });
    }
  }
}
