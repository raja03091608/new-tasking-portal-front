import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public _snackbar:MatSnackBar) { }
  config:MatSnackBarConfig=
  {
    duration:3000,
    horizontalPosition:'center',
    verticalPosition:'top'
  }
  success(msg:any)
  {
    // this.config['panelClass']=['Notification','success'];
    // this._snackbar.open(msg,'',this.config);
    this.config.data={message:msg};
    this.config.panelClass='success-message';
    this.config.horizontalPosition='center';
    this.config.verticalPosition='top';
    this._snackbar.openFromComponent(SnackbarComponent, this.config);
  }
  warn(msg:any)
  {
    this.config.panelClass='';
    this.config.horizontalPosition='center';
    this.config.verticalPosition='top';
    this.config.panelClass='success-message';
    // this.config['panelClass']=['Notification','warn'];
    // this._snackbar.open(msg,'',this.config);
    this.config.data={message:msg};
    this._snackbar.openFromComponent(SnackbarComponent, this.config);
  }
  custom(msg:any)
  {
    this.config.panelClass='';
    this.config.data={message:msg};
    this.config.horizontalPosition='center';
    this.config.verticalPosition='top';
    this._snackbar.openFromComponent(SnackbarComponent, this.config);
  }
  displayMessage(msg:any)
  {
    this.config.panelClass='';
    this.config.horizontalPosition='center';
    this.config.verticalPosition='bottom';
    this.config.duration=5000;

    this._snackbar.open(msg, 'Close',this.config);
  }
}
