import {Component, Injectable, Type} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Observable, of} from 'rxjs';
import {ConfirmDialogComponent} from '../shared/confirm-dialog/confirm-dialog.component';

interface ConfirmDialogData {
  title: string;
  message: string;
}

export interface CanDeactivateComponent {
  canDeactivate: () => boolean | Observable<boolean>;
  getDeactivateDialogData?: () => ConfirmDialogData;
}

@Injectable({providedIn: 'root'})
export class UnsavedChangesGuard implements CanDeactivate<CanDeactivateComponent> {
  constructor(private dialog: MatDialog) {
  }

  canDeactivate(component: CanDeactivateComponent): Observable<boolean> {
    if (component) {
      const result = component.canDeactivate();
      if (typeof result === 'boolean') {
        return result ? of(true) : this.confirm(component);
      }
      return result;
    } else {
      return of(true);
    }
  }

  private confirm(component: CanDeactivateComponent): Observable<boolean> {
    const result: ConfirmDialogData = component.getDeactivateDialogData();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: result.title,
        message: result.message,
      },
    });
    return dialogRef.afterClosed();
  }
}
