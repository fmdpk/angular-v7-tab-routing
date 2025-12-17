import {Component, OnDestroy, OnInit} from '@angular/core';
import {FeatureAService} from '../../core/services/feature-a.service';
import {CanDeactivateComponent} from '../../guards/unsaved-changes.guard';

@Component({
  selector: 'app-feature-a',
  templateUrl: './feature-a.component.html',
  styleUrls: ['./feature-a.component.scss'],
  providers: [FeatureAService],
})
export class FeatureAComponent implements OnInit, CanDeactivateComponent, OnDestroy {
  title = 'feature-a';
  formValue = '';
  savedValue = '';

  ngOnInit() {
    setTimeout(() => {
      this.title = 'feature-a after 2 sec';
    }, 2000);
  }

  canDeactivate(): boolean {
    return this.formValue === this.savedValue; // false = unsaved changes
  }

  getDeactivateDialogData() {
    return {
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Do you really want to close this tab?'
    };
  }


  ngOnDestroy() {
    console.log('FeatureAComponent Destroyed');
  }
}
