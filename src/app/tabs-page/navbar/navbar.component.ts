import { Component, OnInit } from '@angular/core';
import {TabsStateService} from '../tabs-state.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private tabsStateService: TabsStateService, private router: Router) { }

  ngOnInit() {
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

}
