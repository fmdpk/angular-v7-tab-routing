import {
  Component,
  Inject,
  inject,
  Injector, OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {TabInfo, TabsStateService} from './tabs-state.service';
import {UnsavedChangesGuard} from '../guards/unsaved-changes.guard';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';

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

  constructor(
    @Inject(PLATFORM_ID) platformId: string,
    public tabsStateService: TabsStateService,
    private router: Router,
    @Inject(Injector) private injector: any,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.syncTabs();
      this.syncActiveIndex();
    }
  }

  getAllListConnections(index) {
    const connections = [];
    for (let i = 0; i < this.tabs.length; i++) {
      if (i !== index) {
        connections.push('list-' + i);
      }
    }
    return connections;
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
      });
  }

  open(title: string, route: string) {
    this.tabsStateService.tabData$.next({
      key: title,
      title,
      component: null,
      route,
      isDetail: false,
      data: {}
    });
    this.router.navigateByUrl(route);
  }

  async canCLoseTab(tab: TabInfo, index: number) {
    const foundTab = this.tabsStateService.activeComponents$.getValue().find(item => item.tabKey === tab.key);
    if (foundTab && 'canDeactivate' in foundTab.component) {
      const guard = this.injector.get(UnsavedChangesGuard);
      const result = await guard.canDeactivate(foundTab.component).pipe(first()).toPromise();
      if (result) {
        this.closeTab(index, tab.key);
      }
    } else {
      this.closeTab(index, tab.key);
    }
  }

  closeTab(index: number, key: string) {
    this.tabsStateService.closeTab(index, key);
  }

  onActiveChange(index: number) {
    const route = this.tabs[index] ? this.tabs[index].route : '/';
    this.tabsStateService.syncRouter(route).then(res => {
      this.tabsStateService.activeIndex$.next(index);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
