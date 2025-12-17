import {
  Component,
  Inject,
  Injector, OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {isPlatformBrowser} from '@angular/common';
import {TabInfo, TabsStateService} from './tabs-state.service';
import {UnsavedChangesGuard} from '../guards/unsaved-changes.guard';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {TabItem} from '../mat-tab-nav-bar/mat-tab-nav-bar.component';
import {ActivatedRoute} from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
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

  async canCLoseTab(tab: TabInfo, index: number) {
    const foundTab = this.tabsStateService.activeComponents$.getValue().find(item => item.tabKey === tab.key);
    if (foundTab.canDeactivateGuard) {
      const guard = this.injector.get(foundTab.canDeactivateGuard);
      const result = await guard.canDeactivate(foundTab.component).pipe(first()).toPromise();
      if (result) {
        this.closeTab(tab, index);
      }
    } else {
      this.closeTab(tab, index);
    }
  }

  onActiveChange(index: number) {
    const route = this.tabs[index] ? this.tabs[index].route : '/';
    this.tabsStateService.syncRouter(route).then(res => {
      this.tabsStateService.activeIndex$.next(index);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    if (this.activeIndex === event.previousIndex) {
      this.tabsStateService.activeIndex$.next(event.currentIndex);
    } else if (
      this.activeIndex > Math.min(event.previousIndex, event.currentIndex) &&
      this.activeIndex <= Math.max(event.previousIndex, event.currentIndex)
    ) {
      this.tabsStateService.activeIndex$.next(
        event.previousIndex < event.currentIndex
          ? this.tabsStateService.activeIndex$.getValue() - 1
          : this.tabsStateService.activeIndex$.getValue() + 1
      );
    }
  }

  trackByFn(index, item: any) {
    return item.key;
  }

  closeTab(tab: TabInfo, index: number) {
    if (this.activeTab.key === tab.key) {
      const foundTabIndex = this.tabs.findIndex(item => item.key === tab.key);
      this.tabsStateService.closeTab(index, tab.key).then(_ => {
        if (this.tabs[foundTabIndex]) {
          this.activeTab = this.tabs[foundTabIndex];
          this.onActiveChange(foundTabIndex);
          return;
        } else if (this.tabs[foundTabIndex - 1]) {
          this.activeTab = this.tabs[foundTabIndex - 1];
          this.onActiveChange(foundTabIndex - 1);
        }
      });
    } else {
      this.tabsStateService.closeTab(index, tab.key);
    }

  }

  // 4. Handle tab selection
  selectTab(tab: TabItem, index: number) {
    this.activeTab = tab;
    this.onActiveChange(index);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
