import { GroupsService } from 'src/app/shared/services/groups.service';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AccountService } from 'src/app/shared/services/account.service';
import { Deures, Activitat, Deures_activitat, User, Grup } from 'src/app/shared/models/interfaces';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { ExercisesService } from 'src/app/shared/services/exercises.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { combineLatest, switchMap, take, tap } from 'rxjs';
import { Subscription, Observable, BehaviorSubject, Subject, map } from 'rxjs';
import { PointsService } from 'src/app/shared/services/points.service';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeComponent implements OnInit {

  trackByNom(index, grup) {
  return grup.nom;
  }
  
  //MEDAL ICONS FUNCTION
  getMedalIcon(points: number): string {
  if (points > 8) {
    return '../../../../../assets/icons/iconFirst.png';
  } else if (points > 1) {
    return '../../../../../assets/icons/iconSecond.png';
  } else {
    return '../../../../../assets/icons/iconThird.png';
  }
}
  //MAIN DASHBOARD + PENDING HOMEWORK

  currentUser: User | null;

  points$: Observable<string>;
  pointsOrtografia$: Observable<string>;
  pointsLiteratura$: Observable<string>;;
  pointsDialectes$: Observable<string>;;
  pointsGramatica$: Observable<string>;;

  last_activity$: any | null;
  deures_pendents$: Observable<any[]> | null;
  history$: Observable<any[]> | null;
  grups$: Observable<Object[]>;
  grupsSubj = new BehaviorSubject<any[]>([]);
  grupsSubj$ = this.grupsSubj.asObservable();

  //objecte amb totes les variables de view
  vm$: Observable<Object>;

  idGroupAccess: string;
  errorSentQuery: boolean = false;


  constructor(private exService: ExercisesService, private AccountService: AccountService,
    private deuresService: Deures_activitatsService, private groupsService: GroupsService,
    private loaderService: LoaderService, private pointsService: PointsService,
    private cd: ChangeDetectorRef) {
    
    this.currentUser = this.AccountService.currentUser;
    //Opció points reactius
    //de fet no només no cal, sió que es pot fer que punts sigui suma dels altres.
    // this.points$ = this.pointsService.updatePoints$.pipe(switchMap(() => this.pointsService.getPoints(this.currentUser.user_id)));

    this.pointsOrtografia$ = this.pointsService.getPointsOfOrtografia(this.currentUser.user_id);
    this.pointsLiteratura$ = this.pointsService.getPointsOfLiteratura(this.currentUser.user_id);
    this.pointsDialectes$ = this.pointsService.getPointsOfDialectes(this.currentUser.user_id);
    this.pointsGramatica$ = this.pointsService.getPointsOfGramatica(this.currentUser.user_id);
    //s'hauria d'afegir el mateix per a dialectes i gramàtica
    this.deures_pendents$ = this.deuresService.getDeuresPendentsFromUser(this.currentUser.user_id);
    this.history$ = this.deuresService.getAllDeuresActivitatsCompletsFromUser(this.currentUser.user_id);
    this.grups$ = this.grupsSubj$.pipe(
      switchMap(() => this.groupsService.getGroupsByUser(this.currentUser.user_id)),
      map(arr => arr.filter(grup => grup.is_confirmed === 1))
    );
    //el problema és q ara pq s'acualitzi last_activitat$ he de cridar aquesta funció
    this.last_activity$ = this.exService.getActivitatfromId(this.currentUser.id_last_act);
    this.points$ = combineLatest([
    this.pointsOrtografia$,
    this.pointsLiteratura$,
    this.pointsDialectes$,
    this.pointsGramatica$
]).pipe(
    map(([ortografia, literatura, dialectes, gramatica]) => {
      return (parseInt(ortografia) + parseInt(literatura) + parseInt(dialectes) + parseInt(gramatica)).toString();
    })
);
    this.vm$ = combineLatest({
      deures_pendents: this.deures_pendents$,
      history: this.history$,
      last_activity: this.last_activity$,
      grups: this.grups$,
      pointsOrto: this.pointsOrtografia$,
      pointsGram: this.pointsGramatica$,
      pointsDial: this.pointsDialectes$,
      pointsLite: this.pointsLiteratura$

    });

    this.loaderService.showAndHidSpinner();
  }

  ngOnInit() {
    console.log("user welcome component initialized");
    this.pointsService.updatePoints();
    this.grupsSubj.next(undefined);
  }

  //GESTIÓ DE GRUPS - MODAL
  @ViewChild('confirmationModal') private modalComponent!: ConfirmationModalComponent;
  modalStyle: string = '';
  modalTitle: string = '';
  modalBody: string = '';
  modalButtonColor: string = 'btn-danger';
  successMessage: string = '';


  //afegeixo aquesta variable perquè el modal de leave obtingui grup
  selectedGrupId: number;

  submitType: "askAccess" | "leave";

  async openModal(idGrup: number | undefined) {
    //si hi ha idGrup, se sol·licita sortir d'un grup
    if (idGrup) {
      this.submitType = "leave";
      this.selectedGrupId = idGrup;
      this.modalStyle = 'modal-style-danger';
      this.modalComponent.updateText({
        title: 'Deixar grup',
        body: 'Segur que vols deixar el grup?'
      });
      this.modalButtonColor = 'btn-danger';
      const res = await this.modalComponent.open();
      return res;
    //si no hi ha idGrup, se sol·licita accés a un grup (s'obté id de l'input)
    } else if (!idGrup) {
        if (this.idGroupAccess != undefined) {
          this.submitType = "askAccess";
        this.modalStyle = 'modal-style-warning';
        this.modalButtonColor = 'btn-warning';
      this.modalComponent.updateText({
        title: "Sol·licitud d'accés a grup",
        body: "Segur que vols sol·licitar l'accés a aquest grup?"
      });
          this.modalComponent.open();
          return '';
    } else {
          alert("No has introduït cap id.");
          return '';
    }
    }
    return '';
  }
  
  askGroupAccessOrLeave() {
    if (this.submitType == "askAccess") {
      this.askGroupAccess();
    } else if (this.submitType == "leave") {
      this.leaveGroup();
    }
  }

  //funció per crear objecte a "grup_usuaris" amb is_confirmed=0
  askGroupAccess() {
    const idNumber: number = parseInt(this.idGroupAccess, 10);
    this.groupsService.addGrupUsuari(this.currentUser.user_id, idNumber, 0).subscribe({
      next: () => {
        // console.log(`User ${this.currentUser.user_id} has asked to be added to grup ${idNumber}`);
        this.errorSentQuery = false;
        this.modalComponent.updateText({
          title: 'Sol·licitud',
          body: 'Sol·licitud enviada.',
          success: "Sol·licitud enviada correctament. Espera que el professor t'accepti."

        });
        this.modalComponent.open();
      },
      error: error => {
        console.error(`Error en intentar afegir user ${this.currentUser.user_id} a group ${idNumber}: ` + error);
        this.errorSentQuery = true;
        this.modalComponent.updateText({
          title: 'Error',
          body: 'Error en sol·licitat accés al grup',
          success: "Error en intentar accedir al grup."
      });
        this.modalComponent.open();
      }
    });
    this.idGroupAccess = undefined;
  }

  //funció per deixar el grup (després s'actualitza reactivament la llista de grups)
  leaveGroup() {
    this.groupsService.deleteGrupUsuari(this.selectedGrupId, this.currentUser.user_id).subscribe({
      next: () => {
        this.grupsSubj.next(undefined);
        this.successMessage = "Has sortit del grup.";
        this.modalComponent.open();
      },
      error: () => {
        this.successMessage = "Error en intentar sortir del grup.";
        this.modalComponent.open();
      }
  });
}

}
