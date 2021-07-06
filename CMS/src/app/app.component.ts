import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from './session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ComboRacerCMS';

  constructor(translate: TranslateService, private sessionService: SessionService) {
  }

  ngOnInit(): void {
    this.sessionService.updateLanguage();
  }
}
