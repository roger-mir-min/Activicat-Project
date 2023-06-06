import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtraOptions } from '@angular/router';

import { HistoryComponent } from 'src/app/shared/components/history/history.component';
import { TableComponent } from 'src/app/shared/components/history/table/table.component';
import { ProfileConfigComponent } from '../components/profile-config/profile-config.component';
import { DeuresTableComponent } from './components/deures-table/deures-table.component';
import { TeacherHistoryComponent } from './components/teacher-history/teacher-history.component';
import { TeacherGrupsComponent } from './components/teacher-grups/teacher-grups.component';
import { CreateGroupFormComponent } from './components/create-group-form/create-group-form.component';
import { TeacherComponent } from './teacher.component';

import { ExFrameComponent } from '../../exercises/components/ex-frame/ex-frame.component';

import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { TeacherGuard } from 'src/app/shared/guards/teacher.guard';


const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    { path: '', canActivate: [TeacherGuard], component: TeacherComponent },
    { path: 'grups/:id', canActivate: [TeacherGuard], component: TeacherGrupsComponent },
    { path: 'grups/stud-history/:id', canActivate: [TeacherGuard], component: HistoryComponent, children: [
        { path: 'ex', pathMatch: 'full', redirectTo: '' },
        { path: 'ex/:id', component: ExFrameComponent },
    ] },
    { path: 'history', canActivate: [TeacherGuard], component: TeacherHistoryComponent},
    { path: 'deures/:id-deures', canActivate: [TeacherGuard], component: DeuresTableComponent },
    {path: 'deures/ex/:id', canActivate: [TeacherGuard], component: ExFrameComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeacherRoutingModule { }