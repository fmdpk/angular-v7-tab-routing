import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FeatureBComponent} from './feature-b.component';
import {FeatureBDetailsComponent} from './feature-b-details/feature-b-details.component';
import {UnsavedChangesGuard} from '../../guards/unsaved-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: FeatureBComponent,
    canDeactivate: [UnsavedChangesGuard],
    children: [
      {
        path: ':title',
        component: FeatureBDetailsComponent,
        data: {
          modulePath: '../features/feature-b/feature-b.module#FeatureBModule',
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureBRoutingModule {
}
