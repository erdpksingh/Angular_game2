import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationService } from '../notification.service';
import { Notification, NotificationType } from '../notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBarRef: MatSnackBarRef<NotificationComponent>) {
  }

  ngOnInit() {

  }

}

@Component({
  selector: 'app-notification-handler',
  template: ''
})
export class NotificationHandler implements OnInit {

  constructor(private notificationService: NotificationService, private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.notificationService.notification.subscribe(notification => this.showNotification(notification));
  }

  private showNotification(notification: Notification) {
    if (notification == null) {
      return;
    }

    setTimeout(() => {
      let config: MatSnackBarConfig = {
        data: notification
      };
      if (notification.autoClose) {
        config.duration = notification.duration;
      }
      switch (notification.type) {
        case NotificationType.Error:
          config.panelClass = "notification-error";
          break;
        case NotificationType.Success:
          config.panelClass = "notification-success";
          break;
      }
      this.snackBar.openFromComponent(NotificationComponent, config);
    }
    );
  }
}