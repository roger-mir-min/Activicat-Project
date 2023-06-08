import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtraOptions } from '@angular/router';

//Components  
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

//Guards
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('../app/modules/home/home.module').then(m => m.HomeModule)},
  { path: "auth", loadChildren: () => import('../app/modules/login-signup/login-signup.module').then(m => m.LoginSignupModule) },
  { path: 'user', canActivate: [AuthGuard], loadChildren: () => import('../app/modules/user/user.module').then(m => m.UserModule) },
  { path: 'exercises', loadChildren: () => import('../app/modules/exercises/exercises.module').then(m => m.ExercisesModule) },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
