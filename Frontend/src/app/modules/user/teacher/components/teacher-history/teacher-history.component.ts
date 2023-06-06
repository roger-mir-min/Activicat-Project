import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'src/app/shared/models/interfaces';
import { AccountService } from 'src/app/shared/services/account.service';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { Observable, BehaviorSubject, Subject, startWith, switchMap, tap, map } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { copyStringToClipboard } from 'src/app/shared/utility/clipboard.utility';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teacher-history',
  templateUrl: './teacher-history.component.html',
  styleUrls: ['./teacher-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherHistoryComponent implements OnInit {

  webUrl = environment.webUrl;

  switchTable(val: boolean) {
  if (val == true) {
    this.displayedColumns.push('eliminar');
  } else {
    this.displayedColumns.pop();
  }
  this.revisats = val;
  }
  
    trackByNom(index, item) {
    return item.nom_deure;
  }

  async copyLinkToClipboard(link: string) {
    copyStringToClipboard(this.webUrl + link);
  }
  
  //TABLE DATA
  user: User | null;
  deuresProfe$: Observable<Object[]>;
  deuresProfeNotChecked$: Observable<Object[]>;

  updateDeur = new Subject<any[]>;
  updateDeur$ = this.updateDeur.asObservable();

  //Arrays per a les taules
  displayedColumns: string[] = ['nom', 'grup', 'detalls', 'link', 'eliminar'];
  //boolean que determina quina taula es mostra (deures revisats o tots)
  revisats: boolean = true;

  constructor(private AccountService: AccountService, private deuresService: Deures_activitatsService) {
    this.user = this.AccountService.currentUser;
    //obtenim tots els deures posats pel professor
    this.deuresProfe$ = this.updateDeur$.pipe(
      startWith([]),
      switchMap(() => this.deuresService.getDeuresByProfeId(this.user.user_id)));
    //obtenim tots els deures no marcats com a revisats posats pel professor
    this.deuresProfeNotChecked$ = this.updateDeur$.pipe(
      startWith([]),
      switchMap(() => this.deuresService.getDeuresByProfeId(this.user.user_id, 0))
      //filtrem l'array d''objectes deures per eliminar-ne els repetits (la funció de l'api retorna repetits)
      );
  }

  ngOnInit() {
    console.log("teacher-history component initialized");
    this.updateDeur.next(undefined);
  }

  checkDeures(idDeure: number) {
    //mark homework as checked and update homework lists
    this.deuresService.updateDeuresIsChecked(idDeure, 1).subscribe(() => {
      this.updateDeur.next(undefined);
    });
  }

  //DELETE HOMEWORK or GROUP - MODAL
  @ViewChild('confirmationModalLeave') private modalComponent!: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-danger';
  modalTitle: string = 'Esborrar deures';
  modalBody: string = `Segur que vols desfer aquests deures? No podràs veure les respostes
    dels alumnes que l'hagin fet, i la resta d'alumnes ja no podran fer-los.`;
  modalButtonColor: string = 'btn-danger';
  successMessage: string = "Deures esborrats."
  selectedDeureId: number;

  async openModal(idDeur: number) {
    this.selectedDeureId = idDeur;
    return await this.modalComponent.open();
  }

  deleteDeures() {
    //esborra l'objecte deures i tots els deures_activitats relacionats sense completar, i canvio id_deure a 0?
    this.deuresService.deleteHomework(this.selectedDeureId).subscribe({
      next: res => {
        console.log(res);
        this.updateDeur.next(undefined);
        this.modalComponent.open();
      },
      error: err => {
        this.successMessage = "Error en esborrar els deures.";
        this.modalComponent.open();
      }
    });
  }

}
