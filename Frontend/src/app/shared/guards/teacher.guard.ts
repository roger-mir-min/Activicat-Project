import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { AccountService } from '../services/account.service';
import { User } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) { };
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
    console.log('Route guard activated: only user with teacher role (role=1) can access this page.');
    
    let user: User = this.accountService.currentUser;

    if (user.role == 1){
      return true;
    } else {
      // this.router.navigate(['/home']);
      return false;
    }
  }
  
}