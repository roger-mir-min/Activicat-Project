import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { User, Deures, Activitat, Deures_activitat } from 'src/app/shared/models/interfaces';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {

  @ViewChild('targetDiv') targetDiv: ElementRef;

  onScrollToParentDiv(): void {
    this.targetDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  user: User | null;
  ownerOfHistory$: Observable<User>;
  userIsTeacher: boolean = false;
  historial$: Observable<any[]> | null; // deures_activitats + 
  subscript1: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private accountService: AccountService, private deuresService: Deures_activitatsService) {
    this.user = this.accountService.currentUser;
  }

  ngOnInit() {
    console.log("user history component initialized");

  //si s'accedeix com a profe, el user és el del paràmetre de la url; si com a alumne, el user és el loggejat
  this.subscript1 = this.route.url.subscribe(url => {
    const secondToLastSegment = url.length >= 2 ? url[url.length - 2].path : null;
    if (secondToLastSegment === 'stud-history') {
      let studId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
      //només es mostren tots els deures relacionats amb el professor
      this.historial$ = this.deuresService.getDeuresActivitatsByUserAndProfe(studId, this.user.user_id);
      this.ownerOfHistory$ = this.accountService.getUserById(studId);
      this.userIsTeacher = true;
    } else {
      //hauria d ser només les q tinguin is_completed=1
      this.historial$ = this.deuresService.getAllDeuresActivitatsCompletsFromUser(this.user.user_id);
      this.ownerOfHistory$ = of(this.user);
    }
    });
  }  

  ngOnDestroy(): void {
    this.subscript1.unsubscribe();
  }

}
