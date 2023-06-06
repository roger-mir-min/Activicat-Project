import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AccountService } from './shared/services/account.service';
import { User } from './shared/models/interfaces';
import { LoaderService } from './shared/services/loader.service';
import { Observable, switchMap, iif, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Projecte';

  loading$: Observable<boolean>;
  loadingGif$: Observable<boolean>; 

  constructor(private loaderService: LoaderService, private accountService: AccountService) {
    this.loading$ = this.loaderService.isLoading$;
    this.loadingGif$ = this.loaderService.isLoadingGif$;
    this.loaderService.showAndHidSpinner();
  }

  initializeUser() {
    
    this.accountService.getLocalStorageUser().pipe(switchMap
      //si existeix currentUser, s'obté imatge
      (res => iif(() => !!this.accountService.currentUser, this.accountService.getUserImage(), of(null))))
      .subscribe(() => console.log("Canvi d'imatge."));
    
  }

  ngOnInit(): void {

    this.initializeUser();

    console.log("app-component initialized");
      if (this.accountService.isLoggedIn == true) {
      console.log("The current user is: ");
      console.log(this.accountService.currentUser);
    } else {
      console.log("Currently there is no user logged.")
    }
  }

}
