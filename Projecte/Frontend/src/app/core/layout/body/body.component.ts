import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { User } from 'src/app/shared/models/interfaces';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { navigateToAnchor } from 'src/app/shared/utility/navigation';


@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  isLoggedIn: boolean;
  private subscription: Subscription;
  currentUser: User;
  private subscript: Subscription;

  isActive: boolean = true;

  constructor(private location: Location, private router: Router, private accountService: AccountService) {
    this.isLoggedIn = this.accountService.isLoggedIn;
    this.currentUser = this.accountService.currentUser;
  }

  ngOnInit(): void {
    console.log("body component initialized");
    this.subscription = this.accountService.data$.subscribe(
      res => this.isLoggedIn = res);
    this.subscript = this.accountService.currUser$.subscribe(res => {
      this.currentUser = res;
      });
  }

  toggleNav() {
    this.isActive = !this.isActive;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscript) {
      this.subscript.unsubscribe();
    }
  }

  onAnchorClick(path: string, fragment: string, ) {
  navigateToAnchor(path, fragment, this.router, this.location);
}

  logout() {
    this.accountService.logout();
  }

}
