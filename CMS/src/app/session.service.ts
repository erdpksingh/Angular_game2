import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private translateService: TranslateService) {
    this.updateLanguage();
  }

  public setLanguage(language: string) {
    sessionStorage.setItem("language", language);
    this.updateLanguage();
  }

  updateLanguage() {
    let language = sessionStorage.getItem("language");
    if (!language) {
      language = "en";
    }

    this.translateService.use(language);
    this.translateService.setDefaultLang(language);
  }
}
