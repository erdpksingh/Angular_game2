import {Component, AfterViewChecked, OnInit} from '@angular/core';
import {BackendService} from '../backend.service';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NavigationService} from '../navigation.service';
import {SessionService} from '../session.service';
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  autherror = false;
  development = true;
  returnUrl: string;

  constructor(
    private backendService: BackendService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private sessionService: SessionService,
    private notificationService: NotificationService) {

    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.returnUrl = '/' + returnUrl;
    } else {
      this.returnUrl = '/';
    }
  }

  ngOnInit() {
    this.translateService.get('LOGIN.TITLE').subscribe(value => this.navigationService.update(value, null));
    this.backendService.currentUser.subscribe(() => this.redirect());

    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {      
      let languageParam = this.route.snapshot.queryParams['language'];

      if (this.backendService.getCurrentUser() != null) {
        this.router.navigate(['/']);
      } else {

        let email = this.route.snapshot.queryParams['email'];
        let user_id = this.route.snapshot.queryParams['id'];
        let token = this.route.snapshot.queryParams['digest'];
        let timestamp = this.route.snapshot.queryParams['timestamp'];
        
        if (email != null && user_id != null && token != null) {
          this.backendService.loginUser(email, user_id, languageParam, token, timestamp);
        } else {
          this.translateService.get('LOGIN.ERROR_AUTOMATIC_LOGIN_FAILED').subscribe(value => this.notificationService.error(value));
        }

      }
      if (languageParam) {
        this.sessionService.setLanguage(languageParam);
      }
    });
  }

  redirect() {
    let user = this.backendService.getCurrentUser();
    if (user != null) {
      this.router.navigate([this.returnUrl]);
    } else if (user !== undefined) {
      this.autherror = true;
    }
  }

  loginAsAuthor() {
    this.loginWithCredentials('max.mustermann@wegesrand.net', '1234', 'en');
  }

  loginAsAdmin() {
    this.loginWithCredentials('bernhard.klemenjak@zeppelinstudio.net', '1337', 'en');
  }

  loginWithCredentials(email: string, cmsId: string, language: string) {
    let date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    let timestamp = date.valueOf() / 1000;
    let authString = cmsId + ':' + email + ':' + language + ':' + timestamp.toString();
    let token = prompt(authString);
    this.backendService.loginUser(email, cmsId, language, token, timestamp.toString());
  }

}
