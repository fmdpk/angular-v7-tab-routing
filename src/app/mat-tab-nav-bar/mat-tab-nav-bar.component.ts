import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

export interface TabItem {
  id: number;
  label: string;
  content: string;
}

@Component({
  selector: 'app-mat-tab-nav-bar',
  templateUrl: './mat-tab-nav-bar.component.html',
  styleUrls: ['./mat-tab-nav-bar.component.scss']
})
export class MatTabNavBarComponent implements OnInit {
  tabId: number = 0;

  // 1. Define your tabs data
  // tabs = [
  //   {id: 0, label: 'Dashboard', content: 'Dashboard Content Area'},
  //   {id: 1, label: 'Issues', content: 'List of open issues'},
  //   {id: 2, label: 'Pull Requests', content: 'Review pending PRs'},
  //   {id: 3, label: 'Settings', content: 'Global application settings'}
  // ];

  tabs: TabItem[] = [];


  // 2. Track the currently active tab
  activeTab = null;

  ngOnInit() {
    this.createTab();
    this.activeTab = this.tabs[0];
  }

  createTab() {
    this.tabs.push(
      {
        id: this.tabId,
        label: `Dashboard - ${this.tabId}`,
        content: `Dashboard - ${this.tabId} Content Area`
      }
    );
    this.tabId += 1;
    this.activeTab = this.tabs[this.tabs.length - 1];
  }

  // 3. Handle the drop event
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
  }

  closeTab(tab: TabItem) {
    if (this.activeTab.id === tab.id) {
      const foundTabIndex = this.tabs.findIndex(item => item.id === tab.id);
      this.filterTabs(tab);
      if (this.tabs[foundTabIndex]) {
        this.activeTab = this.tabs[foundTabIndex];
      } else if (this.tabs[foundTabIndex - 1]) {
        this.activeTab = this.tabs[foundTabIndex - 1];
      }
    } else {
      this.filterTabs(tab);
    }

  }

  filterTabs(tab: TabItem) {
    this.tabs = this.tabs.filter(item => item.id !== tab.id);
  }

  // 4. Handle tab selection
  selectTab(tab: TabItem) {
    this.activeTab = tab;
  }

}
