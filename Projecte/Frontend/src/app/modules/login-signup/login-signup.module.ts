import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginSignupComponent } from './login-signup.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AlertComponent } from './components/alert/alert.component';

const routes: Routes = [
  { path: '', component: LoginSignupComponent, children: [
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent },
  ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LoginSignupComponent,
    LoginComponent,
    SignupComponent,
    AlertComponent
  ]
})
export class LoginSignupModule { }
