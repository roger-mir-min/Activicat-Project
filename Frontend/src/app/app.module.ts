//angular modules
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';

//custom modules
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './modules/home/home.module';
import { LoginSignupModule } from './modules/login-signup/login-signup.module';
import { UserModule } from './modules/user/user.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

//Angular Material modules
// import { MatChipsModule } from '@angular/material/chips';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatTableModule } from '@angular/material/table';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { DragDropModule } from '@angular/cdk/drag-drop';

//NgBootstrap modules
// import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


//Components
import { AppComponent } from './app.component';

//Services
import { ExercisesService } from './shared/services/exercises.service';
import { OpenAmbitService } from './shared/services/open-ambit.service';
import { Deures_activitatsService } from './shared/services/deures_activitats.service';
import { AccountService } from './shared/services/account.service';
import { GroupsService } from './shared/services/groups.service';
import { PointsService } from './shared/services/points.service';
import { LoaderService } from './shared/services/loader.service';
import { AlertService } from './modules/login-signup/services/alert.service';

//Interceptors
import { ErrorInterceptor } from './shared/guards/error.interceptor';
import { JwtInterceptor } from './shared/guards/jwt.interceptor';

@NgModule({
  declarations: [	
    AppComponent
  ],
  imports: [
    CoreModule,
    HomeModule,
    LoginSignupModule,
    UserModule,
    ExercisesModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    // DragDropModule,
    // MatChipsModule,
    // MatSidenavModule,
    // MatIconModule,
    // MatButtonModule,
    // NgbProgressbarModule,
    // MatTableModule,
    // MatSelectModule,
    // MatInputModule,
    // NgbDropdownModule,
    // NgbNavModule,
    // NgbCollapseModule
  ],
  exports: [],
  providers: [Title, ExercisesService, OpenAmbitService,
    Deures_activitatsService, AccountService,
    GroupsService, LoaderService,
    PointsService, AlertService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
