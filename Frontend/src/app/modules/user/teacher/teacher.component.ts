import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'src/app/shared/models/interfaces';
import { GroupsService } from 'src/app/shared/services/groups.service';
import { AccountService } from 'src/app/shared/services/account.service';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { Observable, combineLatest, BehaviorSubject, switchMap } from 'rxjs';
import { copyStringToClipboard } from 'src/app/shared/utility/clipboard.utility';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherComponent implements OnInit {

  user: User | null;
  deuresNotChecked$: Observable<Object[]>;
  grups$: Observable<Object[]>;
  vm$: Observable<{grups, deuresNotChecked}>;

  updateDeur = new BehaviorSubject<any[]>([]);
  updateDeur$ = this.updateDeur.asObservable();

  constructor(private groupsService: GroupsService, private AccountService: AccountService,
    private deuresService: Deures_activitatsService) {
    this.user = this.AccountService.currentUser;
    this.grups$ = this.updateDeur$.pipe(switchMap(() => this.groupsService.getGroupsByTeacher(this.user.user_id)));
    this.deuresNotChecked$ = this.updateDeur$.pipe(switchMap(() => this.deuresService.getDeuresByProfeId(this.user.user_id, 0)));
    this.vm$ = combineLatest({ grups: this.grups$, deuresNotChecked: this.deuresNotChecked$ });
  }

  ngOnInit() {
    console.log("teacher component initialized");
    this.updateDeur.next(undefined);
  }
  
  checkDeures(idDeure: number) {
    //mark homework as "checked" and update homework lists
    this.deuresService.updateDeuresIsChecked(idDeure, 1).subscribe(() => {
      this.updateDeur.next(undefined);
    });
  }

  createGroup(formVal) {
    this.groupsService.createGrup(formVal.nomNewGrup, formVal.descrNewGrup, this.user.user_id).subscribe(res => {
      console.log(res.id_grup);
      location.reload();
    })
  }

  trackByNom(index, item) {
    return item.nom;
  }

  copyIdToClipboard(id: string) {
    copyStringToClipboard(id);
  }

}