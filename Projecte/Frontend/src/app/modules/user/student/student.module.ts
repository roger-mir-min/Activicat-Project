import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UserModule } from '../user.module';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { StudentComponent } from './student.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PendingComponent } from './components/pending/pending.component';
import { ExFrameComponent } from '../../exercises/components/ex-frame/ex-frame.component';
import { HistoryComponent } from 'src/app/shared/components/history/history.component';

const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'pending', component: PendingComponent },
    { path: 'history', component: HistoryComponent, children: [
        { path: 'ex', pathMatch: 'full', redirectTo: '' },
        { path: 'ex/:id', component: ExFrameComponent },
    ] },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    // MatIconModule,
    // MatButtonModule,
    MatTableModule,
    // MatSelectModule,
    NgbDropdownModule,
    // MatInputModule
  ],
  declarations: [
    StudentComponent,
    WelcomeComponent,
    PendingComponent
  ]
})
export class StudentModule { }
