import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-mat-tab-nav-bar',
  templateUrl: './mat-tab-nav-bar.component.html',
  styleUrls: ['./mat-tab-nav-bar.component.scss']
})
export class MatTabNavBarComponent {

  // 1. Define your tabs data
  tabs = [
    { label: 'Dashboard', content: 'Dashboard Content Area' },
    { label: 'Issues', content: 'List of open issues' },
    { label: 'Pull Requests', content: 'Review pending PRs' },
    { label: 'Settings', content: 'Global application settings' }
  ];

  // 2. Track the currently active tab
  activeTab = this.tabs[0];

  // 3. Handle the drop event
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
  }

  // 4. Handle tab selection
  selectTab(tab) {
    this.activeTab = tab;
  }

}
