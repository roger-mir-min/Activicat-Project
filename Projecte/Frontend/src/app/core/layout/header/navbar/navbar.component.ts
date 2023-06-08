import { Observable } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { navigateToAnchor } from 'src/app/shared/utility/navigation';
import { User } from 'src/app/shared/models/interfaces';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {

  isCollapsed: boolean = true;

  isLoggedIn$: Observable<boolean>;
  currentUser$: Observable<User>;
  userImg$: Observable<string | ArrayBuffer>;

  constructor(private router: Router, private location: Location, private accountService: AccountService) {
    this.isLoggedIn$ = this.accountService.data$;
    this.currentUser$ = this.accountService.currUser$;
    this.userImg$ = this.accountService.userImg$;
  }

  closeCollapse() {
    this.isCollapsed = true;
  }

  ngOnInit() {
    console.log("navbar component initialized");
  }

  navigateUser(user) {
      if (user['role'] == 0) {
        this.router.navigate(['/user', 'student' ]);
      } else {
        this.router.navigate(['/user', 'teacher']);
      }
    this.closeCollapse();
    }

  onAnchorClick(path: string, fragment: string | undefined) {
    navigateToAnchor(path, fragment, this.router, this.location);
    this.closeCollapse();
  }
  
  logout() {
    this.accountService.logout();
    this.closeCollapse();
  }

}
