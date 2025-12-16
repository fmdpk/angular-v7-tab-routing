import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FeatureBComponent} from './feature-b.component';
import {FeatureBDetailsComponent} from './feature-b-details/feature-b-details.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureBComponent,
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
