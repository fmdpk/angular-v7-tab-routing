import {NgModule} from '@angular/core';
import {FeatureBComponent} from './feature-b.component';
import {FeatureBDetailsComponent} from './feature-b-details/feature-b-details.component';
import {RouterModule} from '@angular/router';
import {FeatureBRoutingModule} from './feature-b-routing.module';
import {CommonModule} from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    FeatureBComponent,
    FeatureBDetailsComponent,
  ],
  imports: [
    FeatureBRoutingModule,
    CommonModule,
    MatDialogModule,
    SharedModule
  ],
  providers: [MatDialog],
  entryComponents: [FeatureBComponent],
  bootstrap: [],
  exports: [FeatureBComponent]
})
export class FeatureBModule {
}
