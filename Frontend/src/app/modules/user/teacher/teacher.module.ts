import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
// import { UserModule } from '../user.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { DeuresTableComponent } from './components/deures-table/deures-table.component';
import { TeacherHistoryComponent } from './components/teacher-history/teacher-history.component';
import { TeacherGrupsComponent } from './components/teacher-grups/teacher-grups.component';
import { CreateGroupFormComponent } from './components/create-group-form/create-group-form.component';
import { TeacherComponent } from './teacher.component';
import { HistoryComponent } from 'src/app/shared/components/history/history.component';
import { ExFrameComponent } from '../../exercises/components/ex-frame/ex-frame.component';

const routes: Routes = [
    { path: '', component: TeacherComponent },
    { path: 'grups/:id', component: TeacherGrupsComponent },
    { path: 'grups/stud-history/:id', component: HistoryComponent, children: [
        { path: 'ex', pathMatch: 'full', redirectTo: '' },
        { path: 'ex/:id', component: ExFrameComponent },
    ] },
    { path: 'history', component: TeacherHistoryComponent},
    { path: 'deures/:id-deures', component: DeuresTableComponent },
  { path: 'deures/ex/:id', component: ExFrameComponent },
];



@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
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
    TeacherComponent,
    DeuresTableComponent,
    TeacherHistoryComponent,
    TeacherGrupsComponent,
    CreateGroupFormComponent
    ]
})
export class TeacherModule { }
