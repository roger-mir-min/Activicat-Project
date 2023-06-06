//Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//Angular Material modules
import { MatTableModule } from '@angular/material/table';

//Components
import { SharedComponent } from './shared.component';
import { AreasComponent } from './components/areas/areas.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { HistoryComponent } from './components/history/history.component';
import { TableComponent } from './components/history/table/table.component';

//Pipes
import { AmbitColorPipe } from './pipes/ambit-colors.pipe';
import { IconPipe } from './pipes/icon.pipe';
import { IsExpiredPipe } from './pipes/is-expired.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    AreasComponent,
    ConfirmationModalComponent,
    HistoryComponent,
    TableComponent,
    AmbitColorPipe,
    IconPipe,
    IsExpiredPipe
  ],
  declarations: [
    SharedComponent,
    AreasComponent,
    HistoryComponent,
    TableComponent,
    ConfirmationModalComponent,
    AmbitColorPipe,
    IconPipe,
    IsExpiredPipe
  ]
})
export class SharedModule { }
