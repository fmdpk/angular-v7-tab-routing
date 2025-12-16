import { NgModule } from '@angular/core';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {AdDirective} from '../ad.directive';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    ConfirmDialogComponent,
    AdDirective,
  ],
  imports: [
    MatDialogModule
  ],
  providers: [MatDialog],
  bootstrap: [],
  entryComponents: [ConfirmDialogComponent],
  exports: [ConfirmDialogComponent, AdDirective]
})
export class SharedModule { }
