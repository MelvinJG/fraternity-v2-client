import { Component, OnInit } from '@angular/core';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../../services/spinner.service';
import { UserAuthService } from '../../../services/user-auth.service';
import Swal from 'sweetalert2';
import { TurnsService } from '../../../services/turns.service';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

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
  protected readonly toast = toast;

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
        if (err.status === 0) {
          toast.error(err.message || "Error interno del servidor");
        } else if (err.status === 500) {
          toast.error(err.error.message || "Error interno del servidor");
        } else {
          err.status === 404 ? null : toast.info(err.error.message);
        }
      }
    });
  }

  onSubmit(){
    if(this.turnData.description === "") {
      toast.warning('Por favor complete todos los campos.');
    } else {
      this.spinnerService.show();
      if(!this.isEditing){ //CREAR
        this.turnData.created_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
        this.turnData.idFraternity = this.authService.getUserInfo()?.idFraternity || 777;
        this.turnsService.createTurn(this.turnData).subscribe({
          next: (res: any) => {
            this.spinnerService.hide();
            toast.success('Turno creado exitosamente.');
            this.resetForm();
            this.ngOnInit();
          },
          error: (err: any) => {
            this.spinnerService.hide();
            err.status === 500 || err.status === 0 ? toast.error(err.error.message || err.message || "Error interno del servidor") : toast.info(err.error.message);
          }
        });
      } else {
          delete this.turnData.idFraternity;
          delete this.turnData.created_by;
          delete this.turnData.sold;
          delete this.turnData.id;
          this.turnData.updated_by = this.authService.getUserInfo()?.dpi || 'ERR_DPI_APP';
          this.turnsService.editDeletTurn(this.editingId,this.turnData).subscribe({
            next: (res: any) => {
              this.spinnerService.hide();
              toast.success('Turno actualizado exitosamente.');
              this.resetForm();
              this.ngOnInit();
            },
            error: (err: any) => {
              this.spinnerService.hide();
              err.status === 500 || err.status === 0 ? toast.error(err.error.message || err.message || "Error interno del servidor") : toast.info(err.error.message);
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

  resetForm(){
    this.isEditing = false;
    this.editingId = 0;
    this.turnData = {
      description: '',
      price: null,
      quantity: null,
      armNumber: null,
      sold: 0,
      idFraternity: 0,
      created_by: ''
    };
  }

  onDeleteTurn(idTurn: number){
    const turnToEdit = this.loadData.find(turn => turn.id === idTurn);
    if ((turnToEdit?.sold ?? 0) >= 1) {
      toast.error("No se puede eliminar porque ya se vendio al menos un turno.");
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
              toast.success('Turno eliminado exitosamente.');
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
