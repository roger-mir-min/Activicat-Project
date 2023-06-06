import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LandingComponent } from './components/landing/landing.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: '', component: LandingComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    LandingComponent,
    AboutusComponent,
    OverviewComponent,
    ScrollToTopComponent
  ]
})
export class HomeModule { }
