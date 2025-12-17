import {
  AfterViewInit,
  Component, ComponentFactoryResolver, ComponentRef, Injector,
  Input, NgModuleFactory, NgModuleFactoryLoader,
  OnInit, ViewChild,
} from '@angular/core';
import {TabsStateService} from '../tabs-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AdDirective} from '../../ad.directive';


@Component({
  selector: 'app-material-tab-content',
  templateUrl: './material-tab-content.component.html',
  styleUrls: ['./material-tab-content.component.scss'],
})
export class MaterialTabContentComponent implements AfterViewInit, OnInit {
  @ViewChild(AdDirective) adHost!: AdDirective;
  @Input() componentType!: any;
  @Input() componentData: any;
  @Input() tabKey: any;

  constructor(private router: Router,
              private tabsStateService: TabsStateService,
              private ngModuleFactoryLoader: NgModuleFactoryLoader,
              private injector: Injector,
              private activatedRoute: ActivatedRoute) {
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    const data = this.getRouteData();
    if (this.componentType) {
      this.ngModuleFactoryLoader.load(data.modulePath).then(factory => {
        const compRef = this.createComponent(factory);
        this.modifyActiveComponents(compRef);
        if (this.componentData) {
          (compRef.instance as any).data = this.componentData;
        }
      });
    }
  }

  modifyActiveComponents(compRef: ComponentRef<any>) {
    const activeComps = this.tabsStateService.activeComponents$.getValue();
    activeComps.push({
      tabKey: this.tabKey,
      path: this.router.url,
      component: compRef.instance,
      canDeactivateGuard: this.getDeactivateGuard()
    });
    this.tabsStateService.activeComponents$.next(activeComps);
  }

  getDeactivateGuard() {
    let canDeactivateGuard = null;
    let current = this.activatedRoute.snapshot;
    while (current.firstChild) {
      current = current.firstChild;
      if (!current.firstChild && current.routeConfig.canDeactivate) {
        canDeactivateGuard = current.routeConfig.canDeactivate[0];
      }
    }
    return canDeactivateGuard;
  }

  createComponent(factory: NgModuleFactory<any>): ComponentRef<any> {
    const moduleRef = factory.create(this.injector);
    const resolver = moduleRef.componentFactoryResolver;
    const componentFactory = resolver.resolveComponentFactory(this.componentType);
    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();
    return viewContainerRef.createComponent(componentFactory);
  }

  getRouteData() {
    let data = null;
    let current = this.activatedRoute.snapshot;
    while (current.firstChild) {
      current = current.firstChild;
      if (current.firstChild) {
        data = current.firstChild.data;
      }
    }
    return data;
  }
}
