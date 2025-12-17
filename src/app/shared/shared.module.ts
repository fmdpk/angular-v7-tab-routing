import { NgModule } from '@angular/core';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {AdDirective} from '../ad.directive';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    ConfirmDialogComponent,
    AdDirective,
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    DragDropModule
  ],
  providers: [MatDialog],
  bootstrap: [],
  entryComponents: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent, AdDirective]
})
export class SharedModule { }
