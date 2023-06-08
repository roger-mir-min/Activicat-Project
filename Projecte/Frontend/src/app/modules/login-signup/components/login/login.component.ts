import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Deures, Activitat, Deures_activitat, User, Grup } from 'src/app/shared/models/interfaces';
import { AccountService } from 'src/app/shared/services/account.service';
import { Location } from '@angular/common';
import { Subject, Subscription, first } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/modules/login-signup/services/alert.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  user: User | null;
  loading = false;
  submitted = false;

  constructor(private alertService: AlertService, private accountService: AccountService,
    private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private location: Location, private cdr: ChangeDetectorRef) { }

//Create form
logForm: FormGroup;

//Function to validate form 

//Variable for validation message
userNotFoundError: boolean = false;
//Functions that make it easier to refer to inputEmail and inputKey
get getEmail() {
  return this.logForm.get("inputEmail");
}
  
get getKey() {
  return this.logForm.get("inputKey");
}

  ngOnInit() {

    //Initilialize form
    this.logForm = this.fb.group({
      inputEmail: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      inputKey: ["", Validators.required]
    });

    }

  //function for login submit
  submit(formValue: any) {

    this.submitted = true;
    this.loading = true;

    // reset alerts on submit
    this.alertService.clear();


    if (this.accountService.isLoggedIn == true) {
      console.log("There is a logged user already.");
    } else {
      this.accountService.login(formValue).subscribe({
        next: () => {
          this.userNotFoundError = false;
          // console.log("The introduced user is: ");
          // console.log(formValue);
        },
        error:
          error => {
            this.userNotFoundError = true;
            this.alertService.error(error);
            this.loading = false;
            console.error(error);
            this.cdr.detectChanges();
          }
      });
    }
    }
  }