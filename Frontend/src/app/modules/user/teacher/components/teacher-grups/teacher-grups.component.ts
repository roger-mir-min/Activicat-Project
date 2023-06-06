import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'src/app/shared/models/interfaces';
import { GroupsService } from 'src/app/shared/services/groups.service';
import { AccountService } from 'src/app/shared/services/account.service';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

type submitType = "deleteStudent" | "deleteGroup";

@Component({
  selector: 'app-teacher-grups',
  templateUrl: './teacher-grups.component.html',
  styleUrls: ['./teacher-grups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherGrupsComponent implements OnInit {

  trackById(index: number, user: User) {
    return user.user_id;
  }

  ngOnInit() {
  console.log("teacher-grups component initialized");
  this.updateSubj.next(undefined);
  }

  //PART INFO TAULA
  user: User | null;
  grupId: number;
  grup$: Observable<Object>;
  alumnes$: Observable<Object[]>;
  alumnesPend$: Observable<Object[]>;
  vm$: Observable<{grup, alumnes, alumnesPend}>;

  updateSubj = new BehaviorSubject([]);
  updateSubj$ = this.updateSubj.asObservable();

  displayedColumns: string[] = ['nom', 'email', 'historial', 'eliminar'];

  constructor(private route: ActivatedRoute, private groupsService: GroupsService,
    private AccountService: AccountService, private deuresService: Deures_activitatsService,
    private router: Router) {
    this.user = this.AccountService.currentUser;
    this.grupId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.grup$ = this.groupsService.getGroupById(this.grupId);
    this.alumnes$ = this.updateSubj$.pipe(switchMap(() => this.groupsService.getUsersByGrupId(this.grupId, 1)));
    this.alumnesPend$ = this.updateSubj$.pipe(switchMap(() => this.groupsService.getUsersByGrupId(this.grupId, 0)));
    this.vm$ = combineLatest({ grup: this.grup$, alumnes: this.alumnes$, alumnesPend: this.alumnesPend$ });
  }

   //GESTIÓ GRUP - MODAL
  @ViewChild('confirmationModalStud') private modalComponent!: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-danger';
  modalButtonColor: string = 'btn-danger';
  modalTitle: string;
  modalBody: string;
  successMessage: string;
  selectedStudentId: number;

  submitType: submitType;

  async openModal(idStud?: number, nameStud?: string) {
    if (idStud && nameStud) {
      this.submitType = "deleteStudent";
      this.selectedStudentId = idStud;
      this.modalTitle = `Eliminar alumne`;
      this.modalBody = `Segur que vols eliminar l'alumne ${nameStud} 
      del grup ${this.grupId}?`;
      await this.modalComponent.open();
    } else {
      this.submitType = "deleteGroup";
      this.modalTitle = `Esborrar grup`;
      this.modalBody = `Segur que vols esborrar aquest grup?`;
      await this.modalComponent.open();
    }
  }

  deleteStudentOrGroup() {
    if (this.submitType == "deleteStudent") {
      this.deleteStudentFromGroup()
    } else if (this.submitType == "deleteGroup") {
      this.deleteGroupAndUsers();
    }
  }

  deleteStudentFromGroup() {
    this.groupsService.deleteGrupUsuari(this.grupId, this.selectedStudentId).subscribe({
      next: () => {
        this.updateSubj.next(undefined);
        this.modalComponent.updateText({ success: "Usuari eliminat correctament."});
        this.modalComponent.open();
    },
      error: () => {
        this.modalComponent.updateText({ success: "Error en eliminar l'usuari."});
        this.modalComponent.open();
      }
  });
  }

  confirmUserToGroup(userId: number) {
    this.groupsService.confirmGrupUsuari(userId, this.grupId).subscribe({
      next: res => {
      console.log(res['message']);
      console.log(res['result']);
      this.updateSubj.next(undefined);
      },
      error: err => {
        console.log("Error en l'admissió de l'usuari: " + err)
      }
  });
  }

  deleteGroupAndUsers() {
    this.groupsService.deleteGrupAndUsuaris(this.grupId).subscribe({
      next: res => {
      console.log(res);
        this.router.navigate(['/user/teacher']);
        this.modalComponent.updateText({ success: "Grup eliminat correctament."});
        this.modalComponent.open();
      },
      error: () => {
        this.modalComponent.updateText({ success: "Error en eliminar el grup."});
        this.modalComponent.open();
      }
  });
  }
  
}
