import {Component, OnInit, Type} from '@angular/core';
import {ActivatedRouteSnapshot, ActivationEnd, NavigationEnd, Router} from '@angular/router';
import {TabInfo, TabsStateService} from './tabs-page/tabs-state.service';
import {MENU_ITEM_INTERFACE, MENU_ITEMS} from './core/data/menu-items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [`./app.component.scss`],
})
export class AppComponent implements OnInit {
  title = 'angular-v18-material-tab-routing';
  menuItems: MENU_ITEM_INTERFACE[] = JSON.parse(JSON.stringify(MENU_ITEMS));

  constructor(
    private router: Router,
    private tabsStateService: TabsStateService
  ) {
  }

  ngOnInit() {
    let component: Type<Component> | string | Type<any> | null = null;
    this.router.events.subscribe((res) => {
      if (res instanceof ActivationEnd) {
        if (!res.snapshot.firstChild) {
          component = this.getDeepestComponent(res.snapshot);
        }
      } else if (res instanceof NavigationEnd) {
        this.handleOpenTab(res, component);
      }
    });
  }

  private getDeepestComponent(snapshot: ActivatedRouteSnapshot): any {
    let current = snapshot;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current.component;
  }

  handleOpenTab(res: any, component: Type<Component> | string | Type<any> | null) {
    const data: TabInfo = JSON.parse(JSON.stringify(this.tabsStateService.tabData$.getValue()));
    this.createTab(component, res.url, data);
  }

  createTab(component: Type<Component> | string | Type<any> | null, url: string, data: TabInfo) {
    this.menuItems.forEach(item => {
      if (item.route === url && url.length <= item.route.length) {
        this.openTab(item, component);
        return;
      } else if (item.children.length) {
        item.children.forEach(child => {
          if (url.includes(child.route)) {
            let clonedChild = JSON.parse(JSON.stringify(child));
            clonedChild = this.createTabData({clonedChild, url, child, data});
            this.openTab(clonedChild, component);
          }
        });
      }
    });
  }

  createTabData(args: { clonedChild: MENU_ITEM_INTERFACE, url: string, child: MENU_ITEM_INTERFACE, data: TabInfo }) {
    const split = args.url.split(args.child.route);
    if (args.data && args.data.data) {
      args.clonedChild.data = args.data.data;
    } else {
      const key: string = args.child.param;
      args.clonedChild.data = {
        [key]: split[1]
      };
    }
    args.clonedChild.isDetail = args.data.isDetail ? args.data.isDetail : split.length > 1;
    args.clonedChild.key = args.url;
    args.clonedChild.route = args.url;
    args.clonedChild.title = args.data.title ? args.data.title : (args.child.title + ' ' + split[1]);
    return args.clonedChild;
  }

  openTab(item: MENU_ITEM_INTERFACE, component: any) {
    item.component = component;
    this.tabsStateService.openTab(item);
  }
}
