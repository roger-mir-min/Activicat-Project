import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TeacherGuard } from 'src/app/shared/guards/teacher.guard';

import { UserComponent } from './user.component';
import { ProfileConfigComponent } from './components/profile-config/profile-config.component';

const routes: Routes = [
{ path: '', component: UserComponent, children: [
    { path: 'student', loadChildren: () => import('./student/student.module').then(m => m.StudentModule)},
    { path: 'teacher', canActivate: [TeacherGuard], loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule)},
    { path: 'profile', component: ProfileConfigComponent }
]
}];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule],
    exports: [RouterModule]
})
export class UserRoutingModule { }