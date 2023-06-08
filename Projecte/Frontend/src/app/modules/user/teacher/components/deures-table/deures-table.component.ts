import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { User } from 'src/app/shared/models/interfaces';
import { DatePipe } from '@angular/common';
import { GroupsService } from 'src/app/shared/services/groups.service';
import { AccountService } from 'src/app/shared/services/account.service';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-deures-table',
  templateUrl: './deures-table.component.html',
  styleUrls: ['./deures-table.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeuresTableComponent implements OnInit {

  user: User | null;

  idDeures: string;
  isChecked$: Observable<1 | 0>;
  updateIsChecked= new BehaviorSubject<1 | 0>(0);
  updateIsChecked$ = this.updateIsChecked.asObservable();

  //falta comprovar si està onTime, ho puc fer com a columna o canviant color
  displayedColumns: string[] = ['nom', 'punts', 'errors', 'data', 'complet', 'resposta'];
  dataSource$: Observable<Object[]>;

  constructor(private route: ActivatedRoute, private groupsService: GroupsService,
    private AccountService: AccountService, private deuresService: Deures_activitatsService,
    private datePipe: DatePipe) {
    this.user = this.AccountService.currentUser;
    this.idDeures = this.route.snapshot.paramMap.get('id-deures');
    this.isChecked$ = this.updateIsChecked$.pipe(switchMap(() => this.deuresService.getDeuresByProfeId(this.user.user_id)), map(arr =>
      arr.filter(deure => deure['id_deure'] == this.idDeures)[0]['is_checked'] as 1 | 0
    ));
  }

  ngOnInit() {
    console.log("deures-table component initialized");
    this.updateIsChecked.next(undefined);
    this.dataSource$ = this.deuresService.getDeuresActivitatsByDeureId(parseInt(this.idDeures, 10));
  }

  //mark homework as checked or unchecked (update db and then view)
  checkDeures(is_checked: 1 | 0){
    this.deuresService.updateDeuresIsChecked(parseInt(this.idDeures, 10), is_checked).subscribe(() => {
      is_checked == 0 ? this.updateIsChecked.next(0) : this.updateIsChecked.next(1);
    });
  }
  
  //funció per evitar que les dates amb només 0 (per defecte a db) donin error
  formatDate(date: string): string {
  if (date === '0000-00-00 00:00:00') {
    return 'no entregat';
  } else {
    return this.datePipe.transform(date, 'medium');
  }
}

}
