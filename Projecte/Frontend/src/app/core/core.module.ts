//Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//NgBootstrap modules
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

//Components
import { CoreComponent } from './core.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './layout/header/header.component';
import { NavbarComponent } from './layout/header/navbar/navbar.component';
import { BodyComponent } from './layout/body/body.component';
import { FooterComponent } from './layout/footer/footer.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbCollapse,
    NgbDropdownModule,
    NgbNavModule
  ],
  exports: [
    PageNotFoundComponent,
    HeaderComponent,
    NavbarComponent,
    BodyComponent,
    FooterComponent
  ],
  declarations: [
    CoreComponent,
    PageNotFoundComponent,
    HeaderComponent,
    NavbarComponent,
    BodyComponent,
    FooterComponent
  ]
})
export class CoreModule { }
