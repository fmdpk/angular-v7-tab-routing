import {
  AfterViewInit,
  Component, ComponentFactoryResolver, Injector,
  Input, NgModuleFactoryLoader,
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
              private loader: NgModuleFactoryLoader,
              private injector: Injector,
              private activatedRoute: ActivatedRoute) {
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
    const data = this.getRouteData();
    if (this.componentType) {
      this.loader.load(data.modulePath).then(factory => {
        const moduleRef = factory.create(this.injector);
        const resolver = moduleRef.componentFactoryResolver;
        const componentFactory = resolver.resolveComponentFactory(this.componentType);
        const viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();
        const compRef = viewContainerRef.createComponent(componentFactory);
        const activeComps = this.tabsStateService.activeComponents$.getValue();
        activeComps.push({
          tabKey: this.tabKey,
          path: this.router.url,
          component: compRef.instance
        });
        this.tabsStateService.activeComponents$.next(activeComps);
        if (this.componentData) {
          (compRef.instance as any).data = this.componentData;
        }
      });
    }
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
