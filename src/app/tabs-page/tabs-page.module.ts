import { NgModule } from '@angular/core';
import {TabsPageRoutingModule} from './tabs-page-routing.module';
import {TabsPageComponent} from './tabs-page.component';
import {MaterialTabContentComponent} from './material-tab-content/material-tab-content.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule, MatTabsModule} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {MatTabNavBarComponent} from '../mat-tab-nav-bar/mat-tab-nav-bar.component';


@NgModule({
  declarations: [
    TabsPageComponent,
    MaterialTabContentComponent,
    MatTabNavBarComponent
  ],
  imports: [
    TabsPageRoutingModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    DragDropModule,
    CommonModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [],
  exports: []
})
export class TabsPageModule { }
