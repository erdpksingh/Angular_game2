import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from './notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification = new BehaviorSubject<Notification>(null);

  constructor() { }

  success(message: string, autoClose = true, duration = 3000) {
    this.notify(NotificationType.Success, message, autoClose, duration);
  }

  error(message: string, autoClose = true, duration = 3000) {
    this.notify(NotificationType.Error, message, autoClose, duration);
  }

  info(message: string, autoClose = true, duration = 3000) {
    this.notify(NotificationType.Info, message, autoClose, duration);
  }

  notify(type: NotificationType, message: string, autoClose: boolean, duration: number) {
    this.notification.next({ type: type, message: message, autoClose: autoClose, duration: duration });
  }

}
