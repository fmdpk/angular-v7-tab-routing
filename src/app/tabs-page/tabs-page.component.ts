import {
  Component, ElementRef,
  Inject,
  Injector, OnDestroy,
  OnInit,
  PLATFORM_ID, QueryList, ViewChild, ViewChildren,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {isPlatformBrowser} from '@angular/common';
import {ActiveTabs, TabInfo, TabsStateService} from './tabs-state.service';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {TabItem} from '../mat-tab-nav-bar/mat-tab-nav-bar.component';
import {MatTabNav} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.scss'],
})
export class TabsPageComponent implements OnInit, OnDestroy {
  @ViewChild('tabBar') tabBar!: MatTabNav;
  @ViewChildren('tabLink', {read: ElementRef}) tabLinks!: QueryList<ElementRef>;
  isBrowser: boolean = false;
  activeIndex: number = -1;
  tabs: TabInfo[] = [];
  private destroy$ = new Subject<void>();
  activeTab = null;
  direction: 'rtl' | 'ltr' = 'rtl';
  dynamicTabIndex = 'dynamictabindex';
  showLeftButton = false;
  showRightButton = false;
  canScrollIntoView: boolean = true;

  constructor(
    @Inject(PLATFORM_ID) platformId: string,
    public tabsStateService: TabsStateService,
    public routerSvc: Router,
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
        setTimeout(() => {
          if (this.tabs.length <= res.length && this.tabLinks.length && this.canScrollIntoView) {
            const lastTab = this.tabLinks.last.nativeElement;
            lastTab.scrollIntoView({behavior: 'smooth', inline: 'start'});
          } else if (!this.canScrollIntoView) {
            this.canScrollIntoView = true;
          }
          this.checkOverflow();
        });
        this.tabs = res;
      });
  }

  syncActiveIndex() {
    this.tabsStateService.activeIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.tabs[res] && this.routerSvc.url === this.tabs[res].key) {
          if (this.tabLinks && this.tabLinks.length && this.canScrollIntoView) {
            this.scrollActiveTabIntoView(res);
          } else if (!this.canScrollIntoView) {
            this.canScrollIntoView = true;
          }
          this.activeIndex = res;
          this.activeTab = this.tabs[res];
        } else {
          this.onActiveTabChange(this.activeIndex);
        }
      });
  }

  scrollActiveTabIntoView(activeIndex: number) {
    setTimeout(() => {
      this.tabLinks.forEach(item => {
        if (+item.nativeElement.dataset[this.dynamicTabIndex] === activeIndex) {
          item.nativeElement.scrollIntoView({behavior: 'smooth', inline: 'start'});
        }
      });
    });
  }

  async canCLoseTab(tab: TabInfo, index: number) {
    const foundTab = this.tabsStateService.activeComponents$.getValue().find(item => item.tabKey === tab.key);
    if (foundTab && foundTab.canDeactivateGuard) {
      const guard = this.injector.get(foundTab.canDeactivateGuard);
      const result = await guard.canDeactivate(foundTab.component).pipe(first()).toPromise();
      if (result) {
        await this.closeTab(foundTab, index);
      }
    } else if (foundTab && !foundTab.canDeactivateGuard) {
      await this.closeTab(foundTab, index);
    }
  }

  onActiveTabChange(index: number) {
    const route = this.tabs[index] ? this.tabs[index].route : '/';
    this.tabsStateService.syncRouter(route).then(res => {
      this.tabsStateService.activeIndex$.next(index);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    const [targetIndex, sourceIndex] = this.getMovedItemsIndexes(event);
    if ((targetIndex === sourceIndex) || targetIndex < 0 || sourceIndex < 0) {
      return;
    }

    // reorder tabs with 'targetIndex' and 'sourceIndex'
    moveItemInArray(this.tabs, sourceIndex, targetIndex);

    // sync moved tabs with tabs source in tabs-state.service.ts
    this.tabsStateService.tabs$.next(this.tabs);

    // change active tab
    this.setActiveTab(sourceIndex, targetIndex);
  }

  setActiveTab(sourceIndex: number, targetIndex: number) {
    if (this.activeIndex === sourceIndex) {
      this.tabsStateService.activeIndex$.next(targetIndex);
    } else if (
      this.activeIndex > Math.min(sourceIndex, targetIndex) &&
      this.activeIndex <= Math.max(sourceIndex, targetIndex)
    ) {
      this.tabsStateService.activeIndex$.next(
        sourceIndex < targetIndex
          ? this.tabsStateService.activeIndex$.getValue() - 1
          : this.tabsStateService.activeIndex$.getValue() + 1
      );
    }
  }

  getMovedItemsIndexes(event: CdkDragDrop<any[]>) {
    const targetIndex = this.direction === 'rtl' ? this.tabs.length - 1 - event.currentIndex : event.currentIndex;
    const sourceIndex = this.direction === 'rtl' ? +event.item.element.nativeElement.dataset[this.dynamicTabIndex] : event.previousIndex;
    return [targetIndex, sourceIndex];
  }

  trackByFn(index, item: any) {
    return item.key;
  }

  async closeTab(tab: ActiveTabs, index: number) {
    if (this.activeTab.key === tab.tabKey) {
      const foundTabIndex = this.tabs.findIndex(item => item.key === tab.tabKey);
      await this.tabsStateService.closeTab(index, tab.tabKey);
      if (this.tabs[foundTabIndex]) {
        this.activeTab = this.tabs[foundTabIndex];
        this.onActiveTabChange(foundTabIndex);
        return;
      } else if (this.tabs[foundTabIndex - 1]) {
        this.activeTab = this.tabs[foundTabIndex - 1];
        this.onActiveTabChange(foundTabIndex - 1);
        return;
      } else if (!this.tabs.length) {
        await this.tabsStateService.syncRouter('/');
      }
    } else {
      await this.tabsStateService.closeTab(index, tab.tabKey);
    }
  }

  // 4. Handle tab selection
  selectTab(tab: TabInfo, index: number) {
    this.canScrollIntoView = false;
    this.activeTab = tab;
    this.onActiveTabChange(index);
  }

  checkOverflow() {
    const wrapper = document.getElementsByClassName('chrome-tabs')[0];
    const el = wrapper.querySelectorAll('.mat-tab-links')[0];
    this.showLeftButton = el.scrollWidth > el.clientWidth + el.scrollLeft;
    this.showRightButton = el.scrollWidth > el.clientWidth + el.scrollLeft;
  }

  scrollTabs(offset: number) {
    const wrapper = document.getElementsByClassName('chrome-tabs')[0];
    const el = wrapper.querySelectorAll('.mat-tab-links')[0];
    el.scrollTo({left: el.scrollLeft + offset, behavior: 'smooth'});
    setTimeout(() => this.checkOverflow(), 300);
  }

  getDragStart(event: any) {
    this.canScrollIntoView = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
