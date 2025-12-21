import {NgModule} from '@angular/core';
import {FeatureBComponent} from './feature-b.component';
import {FeatureBDetailsComponent} from './feature-b-details/feature-b-details.component';
import {FeatureBRoutingModule} from './feature-b-routing.module';
import {CommonModule} from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    FeatureBComponent,
    FeatureBDetailsComponent,
  ],
  imports: [
    FeatureBRoutingModule,
    CommonModule,
    MatDialogModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MatDialog],
  entryComponents: [FeatureBComponent],
  bootstrap: [],
  exports: [FeatureBComponent]
})
export class FeatureBModule {
}
