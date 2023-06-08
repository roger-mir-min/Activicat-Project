import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { GroupsService } from 'src/app/shared/services/groups.service';
import { User, Deures_activitat, Grup, Activitat, Deures } from 'src/app/shared/models/interfaces';
import { Deures_activitatsService } from 'src/app/shared/services/deures_activitats.service';
import { Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingComponent implements OnInit {

  currentUser: User | null;
  deures_pendents$: Observable<any[]> | null;

  constructor(private accountService: AccountService, private deuresService: Deures_activitatsService, private groupService: GroupsService) {
    this.currentUser = this.accountService.currentUser;
    //això de sota ho he tret provisionalment pro es pot reaprofitar
    this.deures_pendents$ = this.deuresService.getDeuresPendentsFromUser(this.currentUser.user_id);
  }

  ngOnInit() {
    console.log("pending (activities) component initialized");
    
    
  }

  getCurrentTime(): Date {
    return new Date();
  }


}