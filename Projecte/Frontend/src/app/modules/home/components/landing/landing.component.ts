import { Component, ElementRef, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AccountService } from 'src/app/shared/services/account.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/interfaces';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit {

  isLoggedIn: boolean;
  private subscription: Subscription;
  currentUser: User;
  private subscript: Subscription;

  constructor(private accountService: AccountService, private router: Router,
    private location: Location) { }


  ngOnInit() {
    //Subscription to service
    this.subscription = this.accountService.data$.subscribe(
      res => this.isLoggedIn = res);
    this.subscript = this.accountService.currUser$.subscribe(res => {
      this.currentUser = res;
    });
  
  }

  navigateToStudentForm() {
  this.router.navigate(['/signup'], { queryParams: { select: '0' } });
}

  navigateToTeacherForm() {
  this.router.navigate(['/signup'], { queryParams: { select: '1' } });
}


    ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

}
