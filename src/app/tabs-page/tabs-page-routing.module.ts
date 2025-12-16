import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TabsPageComponent} from './tabs-page.component';
import {AuthGuard} from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPageComponent,
    children: [
      {
        path: 'feature-a',
        canActivate: [AuthGuard],
        loadChildren: '../features/feature-a/feature-a.module#FeatureAModule',
        data: {
          modulePath: '../features/feature-a/feature-a.module#FeatureAModule',
        }
      },
      {
        path: 'feature-b',
        loadChildren: '../features/feature-b/feature-b.module#FeatureBModule',
        data: {
          modulePath: '../features/feature-b/feature-b.module#FeatureBModule',
        }
      },
      {
        path: 'feature-c',
        loadChildren: '../features/feature-c/feature-c.module#FeatureCModule',
        data: {
          modulePath: '../features/feature-c/feature-c.module#FeatureCModule',
        }
      },
      // {
      //   path: '',
      //   redirectTo: 'feature-a',
      //   pathMatch: 'full'
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
