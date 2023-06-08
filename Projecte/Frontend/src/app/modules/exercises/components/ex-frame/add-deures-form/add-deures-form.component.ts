import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { GroupsService } from 'src/app/shared/services/groups.service';
import { User } from 'src/app/shared/models/interfaces';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-add-deures-form',
  templateUrl: './add-deures-form.component.html',
  styleUrls: ['./add-deures-form.component.scss']
})
export class AddDeuresFormComponent implements OnInit {

    //MODAL------------
  @ViewChild('confirmationModalLeave') private modalComponent!: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-warning';
  modalTitle: string = 'Enviar activitat';
  modalBody: string = 'Segur que vols posar aquesta activitat?';
  modalButtonColor: string = 'btn-warning';
  successMessage: string = "Deures enviats correctament."

  async openModal() {
    this.modalBody = `Segur que vols posar aquesta activitat al grup ${this.selectedGrup} 
    amb data límit ${this.datetime}?`;
    return await this.modalComponent.open();
  }


  //--------------


  user: Object; //és User
  @Input() activId: number;
  // user: User;
  grups$: Observable<Object[]>;
  selectedGrup: string;
  descrDeures: string;
  datetime: string;

  constructor(private accService: AccountService, private deuresService: Deures_activitatsService, private groupsService: GroupsService) {
    this.user = this.accService.currentUser;
    this.grups$ = this.groupsService.getGroupsByTeacher(this.user['user_id']);
  }

  ngOnInit() {
    console.log("add-deures-form component initialized");
  }

  onSubmit(form: any) {
    //podria passar form.value per simplificar
    this.deuresService.createHomework(form.value.grup, form.value.descrDeures, form.value.datetime, this.activId);
    this.selectedGrup = "";
    this.datetime = "";
    this.descrDeures = "";
  }

}
