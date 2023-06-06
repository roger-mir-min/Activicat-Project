import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) { };
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean {
    console.log('Route guard activated: only logged in users can access this page.');
    
      let isLoggedIn = this.accountService.isLoggedIn;

    if (isLoggedIn){
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}