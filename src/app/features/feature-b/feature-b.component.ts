import {Component, inject, OnDestroy} from '@angular/core';
import {TabInfo, TabsStateService} from '../../tabs-page/tabs-state.service';
import {Router, RouterOutlet} from '@angular/router';
import {FeatureBService} from '../../core/services/feature-b.service';

@Component({
  selector: 'app-feature-b',
  templateUrl: './feature-b.component.html',
  styleUrls: ['./feature-b.component.scss'],
  providers: [FeatureBService],
})
export class FeatureBComponent implements OnDestroy {

  constructor(
    private router: Router,
    private tabsStateService: TabsStateService
  ) {
  }

  list: TabInfo[] = [
    {
      key: 'item-1',
      title: 'Item 1',
      route: '/tabs/feature-b/1',
      component: '',
      isDetail: true,
      data: {},
    },
    {
      key: 'item-2',
      title: 'Item 2',
      route: '/tabs/feature-b/2',
      component: '',
      isDetail: true,
      data: {},
    },
  ];

  goToDetail(event: MouseEvent, item: TabInfo, index: number) {
    (event.target as HTMLElement).blur();
    this.tabsStateService.tabData$.next({
      key: item.title,
      title: item.title,
      component: null,
      route: item.route,
      isDetail: item.isDetail,
      data: {
        title: index + 1
      }
    });
    this.router.navigateByUrl(item.route);
  }

  trackByFn(index, item: any) {
    return index;
  }

  ngOnDestroy() {
    console.log('FeatureBComponent Destroyed');
  }
}
