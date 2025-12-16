import { NgModule } from '@angular/core';
import {FeatureARoutingModule} from './feature-a-routing.module';
import {FeatureAComponent} from './feature-a.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    FeatureAComponent
  ],
  imports: [
    FeatureARoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [FeatureAComponent],
  exports: [FeatureAComponent]
})
export class FeatureAModule { }
