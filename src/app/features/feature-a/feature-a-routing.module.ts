import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FeatureAComponent} from './feature-a.component';
import {UnsavedChangesGuard} from '../../guards/unsaved-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: FeatureAComponent,
    canDeactivate: [UnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureARoutingModule {
}
