import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

import { UserComponent } from './user.component';
import { ProfileConfigComponent } from './components/profile-config/profile-config.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ProfileConfigComponent
  ],
  declarations: [
    UserComponent,
    ProfileConfigComponent
  ]
})
export class UserModule { }
