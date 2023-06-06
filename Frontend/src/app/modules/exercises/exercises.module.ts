import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DragDropModule } from '@angular/cdk/drag-drop';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatSidenavModule } from '@angular/material/sidenav';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { ExercisesComponent } from './exercises.component';
import { MainListComponent } from './components/ex-lists/main-list/main-list.component';
import { AmbitComponent } from './components/ex-lists/ambit/ambit.component';
import { ExFrameComponent } from './components/ex-frame/ex-frame.component';
import { ProgressBarComponent } from './components/ex-frame/progress-bar/progress-bar.component';
import { AddDeuresFormComponent } from './components/ex-frame/add-deures-form/add-deures-form.component';
import { ExTypeCompleteComponent } from './components/ex-frame/ex-type-complete/ex-type-complete.component';
// import { ExTypeClassifyComponent } from './components/ex-frame/ex-type-classify/ex-type-classify.component';
// import { ExTypeOrderChipComponent } from './components/ex-frame/ex-type-orderChip/ex-type-orderChip.component';
// import { ExTypeOrderDragComponent } from './components/ex-frame/ex-type-orderDrag/ex-type-orderDrag.component';
// import { ExTypeRelateComponent } from './components/ex-frame/ex-type-relate/ex-type-relate.component';

import { SortByPipe } from './pipes/sort-by.pipe';

const routes: Routes = [
  { path: '', component: ExercisesComponent, children: [
    { path: 'main-list', component: MainListComponent },
    { path: 'ex', pathMatch: 'full', redirectTo: 'main-list' },
    { path: 'ex/:id', component: ExFrameComponent }
    ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // DragDropModule,
    // MatChipsModule,
    // MatSidenavModule,
    NgbProgressbarModule,
    // MatIconModule,
    // MatButtonModule,
    // MatSelectModule,
    // MatInputModule,
    NgbDropdownModule,
    NgbAccordionModule
  ],
  declarations: [
    SortByPipe,
    ExercisesComponent,
    MainListComponent,
    AmbitComponent,
    ExFrameComponent,
    ProgressBarComponent,
    AddDeuresFormComponent,
    ExTypeCompleteComponent,
    // ExTypeClassifyComponent,
    // ExTypeOrderChipComponent,
    // ExTypeOrderDragComponent,
    // ExTypeRelateComponent
  ],
  exports: [
    ExFrameComponent
  ]
})
export class ExercisesModule { }
