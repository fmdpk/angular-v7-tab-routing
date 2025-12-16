import { NgModule } from '@angular/core';
import {FeatureCRoutingModule} from './feature-c-routing.module';
import {FeatureCComponent} from './feature-c.component';


@NgModule({
  declarations: [
    FeatureCComponent
  ],
  imports: [
    FeatureCRoutingModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [FeatureCComponent],
  exports: [FeatureCComponent]
})
export class FeatureCModule { }
