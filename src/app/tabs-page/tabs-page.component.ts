import {
  Component,
  Inject,
  Injector, OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray, transferArrayItem,
} from '@angular/cdk/drag-drop';
import {isPlatformBrowser} from '@angular/common';
import {ActiveTabs, TabInfo, TabsStateService} from './tabs-state.service';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {TabItem} from '../mat-tab-nav-bar/mat-tab-nav-bar.component';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.scss'],
})
export class TabsPageComponent implements OnInit, OnDestroy {
  isBrowser: boolean = false;
  activeIndex: number = -1;
  tabs: TabInfo[] = [];
  private destroy$ = new Subject<void>();
  activeTab = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: string,
    public tabsStateService: TabsStateService,
    @Inject(Injector) private injector: Injector,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.syncTabs();
      this.syncActiveIndex();
    }
  }

  syncTabs() {
    this.tabsStateService.tabs$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
        this.tabs = res;
      });
  }

  syncActiveIndex() {
    this.tabsStateService.activeIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.activeIndex = res;
        this.activeTab = this.tabs[res];
      });
  }

  async canCLoseTab(tab: ActiveTabs, index: number) {
    console.log(index);
    const foundTab = this.tabsStateService.activeComponents$.getValue().find(item => item.tabKey === tab.tabKey);
    if (foundTab.canDeactivateGuard) {
      const guard = this.injector.get(foundTab.canDeactivateGuard);
      const result = await guard.canDeactivate(foundTab.component).pipe(first()).toPromise();
      if (result) {
        this.closeTab(foundTab, index);
      }
    } else {
      this.closeTab(foundTab, index);
    }
  }

  onActiveChange(index: number) {
    const route = this.tabs[index] ? this.tabs[index].route : '/';
    this.tabsStateService.syncRouter(route).then(res => {
      this.tabsStateService.activeIndex$.next(index);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
    const length = event.container.data.length;

    const targetIndex = length - 1 - event.currentIndex

    const targetTab = event.container.data[targetIndex];

    console.log('Dropped on:', targetTab);
    moveItemInArray(this.tabs, event.previousIndex, targetIndex);
    if (this.activeIndex === event.previousIndex) {
      this.tabsStateService.activeIndex$.next(targetIndex);
    } else if (
      this.activeIndex > Math.min(event.previousIndex, targetIndex) &&
      this.activeIndex <= Math.max(event.previousIndex, targetIndex)
    ) {
      this.tabsStateService.activeIndex$.next(
        event.previousIndex < targetIndex
          ? this.tabsStateService.activeIndex$.getValue() - 1
          : this.tabsStateService.activeIndex$.getValue() + 1
      );
    }
  }

  trackByFn(index, item: any) {
    return item.key;
  }

  closeTab(tab: ActiveTabs, index: number) {
    if (this.activeTab.key === tab.tabKey) {
      const foundTabIndex = this.tabs.findIndex(item => item.key === tab.tabKey);
      this.tabsStateService.closeTab(index, tab.tabKey).then(_ => {
        if (this.tabs[foundTabIndex]) {
          this.activeTab = this.tabs[foundTabIndex];
          this.onActiveChange(foundTabIndex);
          return;
        } else if (this.tabs[foundTabIndex - 1]) {
          this.activeTab = this.tabs[foundTabIndex - 1];
          this.onActiveChange(foundTabIndex - 1);
          return;
        } else if (!this.tabs.length) {
          this.tabsStateService.syncRouter('/');
        }
      });
    } else {
      this.tabsStateService.closeTab(index, tab.tabKey);
    }

  }

  // 4. Handle tab selection
  selectTab(tab: TabItem, index: number) {
    this.activeTab = tab;
    this.onActiveChange(index);
  }

  getDropped(event) {
    console.log(event);
  }

  getEntered(event) {
    console.log(event);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
