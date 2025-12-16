import {Component, Input, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-feature-b-details',
  templateUrl: './feature-b-details.component.html',
  styleUrls: ['./feature-b-details.component.scss'],
})
export class FeatureBDetailsComponent implements OnInit {
  @Input('title') title: any;
  @Input('data') data: any;
  titleStr: string = '';

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.titleStr = this.data.title;
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Unsaved Changes',
        message:
          'You have unsaved changes. Do you really want to close this tab?',
      },
    });
  }
}
