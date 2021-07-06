import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app-config';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  static settings: AppConfig;
  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  loadConfig() {
    const filePath = "assets/config.json";
    return new Promise<void>((resolve, reject) => {
      this.http.get(filePath).toPromise().then((response: AppConfig) => {
        ConfigService.settings = response;
        resolve();
      }).catch((response: any) => {
        this.notificationService.error("ERROR.COULD_NOT_LOAD_CONFIG", false);
        resolve();
        //reject("Error while loading config file: ${JSON.stringify(response)}");
      });
    })
  }
}
