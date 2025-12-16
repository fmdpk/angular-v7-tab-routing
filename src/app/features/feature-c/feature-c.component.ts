import {Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-feature-c',
  templateUrl: './feature-c.component.html',
  styleUrls: ['./feature-c.component.scss']
})
export class FeatureCComponent implements OnDestroy {

  ngOnDestroy() {
    console.log('FeatureCComponent Destroyed');
  }
}
