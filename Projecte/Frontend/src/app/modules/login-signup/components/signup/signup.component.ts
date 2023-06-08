import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Login, User, SignUpForm } from 'src/app/shared/models/interfaces';
import { AccountService } from 'src/app/shared/services/account.service';
import { AlertService } from 'src/app/modules/login-signup/services/alert.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

  registerSuccess: boolean = true;
  loading = false;
  submitted = false;
  emailAlreadyRegistered = false;

  //Create reactive form group
  signupForm: FormGroup & {value: SignUpForm}; 

  constructor(private alertService: AlertService, private accountService: AccountService,
    private fb: FormBuilder, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { 
    //Create form group (with form builder)
    this.signupForm = fb.group({
      inputNom: ["", [Validators.required]],
      inputEmail: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      inputKey: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      inputRepKey: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      inputRole: ["", [Validators.required]]
  }, { validators: this.confValidator('inputKey', 'inputRepKey') });
  }

  //Create custom validation
  confValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors['confValidator']) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

//Functions to get the form controls (for validation)
get getNom() {
return this.signupForm.get("inputNom");
  }  
  
get getEmail() {
  return this.signupForm.get("inputEmail");
}
  
get getKey() {
  return this.signupForm.get("inputKey");
}  

get getRepKey() {
  return this.signupForm.get("inputRepKey");
  }  

get getRole() {
  return this.signupForm.get("inputRole");
  }  
  
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
    const selectValue = params['select'];
    if (selectValue === '0') {
      this.signupForm.get('inputRole').setValue('0');
    } else if (selectValue === '1') {
      this.signupForm.get('inputRole').setValue('1');
    }
  });
  }

  submit(formValue: SignUpForm): void {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // this.accountService.register(this.form.value)
    //         .pipe(first())
    //         .subscribe({
    //             next: () => {
    //                 this.alertService.success('Registration successful', { keepAfterRouteChange: true });
    //                 this.router.navigate(['../login'], { relativeTo: this.route });
    //             },
    //             error: error => {
    //                 this.alertService.error(error);
    //                 this.loading = false;
    //             }
    //         });

    this.accountService.signup(formValue).subscribe({
      next: res => {
        // console.log("Signup efectuat. El token rebut és: ");
        // console.log(res['token']);
        this.emailAlreadyRegistered = false;
        this.alertService.success('Registration successful', { keepAfterRouteChange: true });
        
        this.accountService.login(formValue).subscribe({
          next: () => {
            this.emailAlreadyRegistered = false;
            // console.log("The introduced user is: ");
            // console.log(formValue);
          },
          error:
            error => {
              this.emailAlreadyRegistered = true;
              this.alertService.error(error);
              this.loading = false;
              console.error(error);
              this.cdr.detectChanges();
            }
        })
      },
      error: err => {
        this.emailAlreadyRegistered = true;
        this.alertService.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    
}

}
