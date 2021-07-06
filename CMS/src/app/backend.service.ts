import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { Game } from './game';
import { GameLanguage } from './game-language';
import { Language } from './language';
import { User, UserRole } from './user';
import { KeyValuePair} from './content';
import { UserGameLanguage } from './user-game-language';
import { NavigationService } from './navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from './config.service';
import { NotificationService } from './notification.service';
import {AuditLogEntry} from './audit';
import {AdminSettings} from './admin-settings';
import {Papa} from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  endpoint: string;
  hash = "d41d8cd98f00b204e9800998ecf8427e";

  private currentUserSource: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private httpClient: HttpClient,
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private papa: Papa) {

    if (ConfigService.settings) {
      this.endpoint = ConfigService.settings.api_url;
    }
    const sessionUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (sessionUser != null) {
      this.currentUserSource = new BehaviorSubject<User>(sessionUser);
    } else {
      this.currentUserSource = new BehaviorSubject<User>(undefined);
    }
    this.currentUser = this.currentUserSource.asObservable();

    if (this.getCurrentUser() == null) {
      /*let username = this.route.snapshot.paramMap.get("username");
      if (!username || username.length == 0) {
        username = "bernhard.klemenjak@zeppelinstudio.net";
      }
      this.loginUser(username);*/
    } else {
      this.finishLogin(this.getCurrentUser());
    }
  }

  public getCurrentUser(): User {
    return this.currentUserSource.value;
  }

  private getDefaultHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.hash
    });
    const user = this.getCurrentUser();
    if (user != null) {
      headers = headers
        .set('cmsid', user.cmsId)
        .set('email', user.email)
        .set('language', user.language)
        .set('token', user.token)
        .set('timestamp', user.timestamp);
    }
    return headers;
  }

  private getDefaultParams(): HttpParams {
    let params = new HttpParams();
    const user = this.getCurrentUser();
    if (user != null) {
      params = params
        .set('user_id', user.id.toString());
    }
    return params;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      // HTTP response error

      // check if session is invalid
      if (error.status === 401 && this.getCurrentUser() !== null) {
        this.invalidateSession();
      }

      console.error(
        `HTTP status ${error.status}, ` +
        `details: ${error.error}`);
      this.notificationService.error('ERROR.REQUEST_FAILED');
    }
    return throwError('Request failed');
  }

  public isAdmin(): boolean {
    return this.getCurrentUser() != null && this.getCurrentUser().role == UserRole.Admin;
  }

  loginUser(username: string, cmsId: string, language: string, token: string, timestamp: string) {
    const params = this.getDefaultParams().set('username', username);
    const headers = this.getDefaultHeaders().set('cmsid', cmsId).set('email', username).set('language', language).set('token', token).set('timestamp', timestamp);
    this.httpClient.get<User>(this.endpoint + '/login', {headers, params}).pipe(
      catchError(error => this.loginFailed(error))).subscribe(user => {
      user.cmsId = cmsId;
      user.email = username;
      user.language = language;
      user.token = token;
      user.timestamp = timestamp;
      this.finishLogin(user);
    });
  }

  private loginFailed(error: HttpErrorResponse) {
    this.currentUserSource.next(null);
    return this.handleError(error);
  }

  finishLogin(user: User) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.navigationService.setUsername(user.username);
  }

  invalidateSession(): void {
    sessionStorage.setItem('currentUser', null);
    this.currentUserSource.next(null);
    this.router.navigate(['/session-timeout']);
  }

  getAuthorGames(): Observable<Game[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<Game[]>(this.endpoint + "/users/" + this.getCurrentUser().id.toString() + "/games", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getAdminGames(): Observable<Game[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<Game[]>(this.endpoint + "/games", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getGame(id: number): Observable<Game> {
    let params = this.getDefaultParams();
    return this.httpClient.get<Game>(this.endpoint + "/games/" + id.toString(), { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getAuthorGameLanguage(game_id: Number): Observable<GameLanguage[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<GameLanguage[]>(this.endpoint + "/users/" + this.getCurrentUser().id.toString() + "/games/" + game_id.toString() + "/languages", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getUserGameLanguages(user_id: number): Observable<GameLanguage[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<GameLanguage[]>(this.endpoint + "/users/" + user_id.toString() + "/languages", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  addGame(name: string, base_language: string): Observable<Game> {
    let params = this.getDefaultParams();
    let content = {
      "name": name,
      "base_language": base_language
    };
    return this.httpClient.post<Game>(this.endpoint + "/games/", content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  updateAdminGameLanguage(game: Game): Observable<Game> {
    let params = this.getDefaultParams();
    let content = {
      "name": game.name,
      "base_language": game.base_language
    };
    return this.httpClient.post<Game>(this.endpoint + "/games/" + game.id.toString(), content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));    
  }

  deleteGame(game: Game): Observable<Game> {
    let params = this.getDefaultParams();
    return this.httpClient.delete<Game>(this.endpoint + "/games/" + game.id.toString(), { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  /** ADMIN */

  getUsers(): Observable<User[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<User[]>(this.endpoint + "/users", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getAdminGameLanguage(game_id: Number): Observable<GameLanguage[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<GameLanguage[]>(this.endpoint + "/games/" + game_id.toString() + "/languages", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getAllGameLanguages(): Observable<GameLanguage[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<GameLanguage[]>(this.endpoint + "/game_languages", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getGameLanguage(id: Number): Observable<GameLanguage> {
    let params = this.getDefaultParams();
    return this.httpClient.get<GameLanguage>(this.endpoint + "/game_languages/" + id.toString(), { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getAvailableLanguages(): Observable<Language[]> {
    let params = this.getDefaultParams();
    return this.httpClient.get<Language[]>(this.endpoint + "/languages", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  addGameLanguage(game_id: number, language_id: string, base_language: string): Observable<GameLanguage> {
    let content: GameLanguage = {
      "id": -1,
      "game_id": game_id,
      "language_id": language_id,
      "base_language": base_language
    };
    let params = this.getDefaultParams();
    return this.httpClient.post<GameLanguage>(this.endpoint + "/game_languages", content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  deleteGameLanguage(gameLanguage: GameLanguage): Observable<GameLanguage> {
    let params = this.getDefaultParams();
    return this.httpClient.delete<GameLanguage>(this.endpoint + "/game_languages/" + gameLanguage.id.toString(), { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  submitGameLanguage(gameLanguage: GameLanguage): Observable<GameLanguage> {
    let params = this.getDefaultParams();
    return this.httpClient.get<GameLanguage>(this.endpoint + "/game_languages/" + gameLanguage.id.toString() + "/submit", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  rejectGameLanguage(gameLanguage: GameLanguage): Observable<GameLanguage> {
    let params = this.getDefaultParams();
    return this.httpClient.get<GameLanguage>(this.endpoint + "/game_languages/" + gameLanguage.id.toString() + "/reject", { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  deployGameLanguage(gameLanguage: GameLanguage): Observable<GameLanguage> {
    let params = this.getDefaultParams();
    return this.httpClient.post<GameLanguage>(this.endpoint + "/game_languages/" + gameLanguage.id.toString() + "/deploy", {}, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  deployGameLanguageTest(gameLanguage: GameLanguage): Observable<GameLanguage> {
    let params = this.getDefaultParams();
    return this.httpClient.post<GameLanguage>(this.endpoint + "/game_languages/" + gameLanguage.id.toString() + "/deploy_test", {}, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  addUserGameLanguage(game_language_id: number, user_id: number): Observable<UserGameLanguage> {
    let content: UserGameLanguage = {
      "game_language_id": game_language_id,
      "user_id": user_id
    };
    let params = this.getDefaultParams();
    return this.httpClient.post<UserGameLanguage>(this.endpoint + "/users/" + user_id.toString() + "/languages", content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  deleteUserGameLanguage(user_id: number, game_language_id: number): any {
    let params = this.getDefaultParams();
    return this.httpClient.delete<UserGameLanguage>(this.endpoint + "/users/" + user_id.toString() + "/languages/" + game_language_id.toString(), { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  addUser(username: string, role: number): Observable<User> {
    let content: User = {
      "id": -1,
      "username": username,
      "role": role
    };
    let params = this.getDefaultParams();
    return this.httpClient.post<User>(this.endpoint + "/users", content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  updateUser(user: User) {
    let params = this.getDefaultParams();
    return this.httpClient.put<User>(this.endpoint + "/users/" + user.id.toString(), user, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  deleteUser(id: number): Observable<User> {
    let params = this.getDefaultParams();
    return this.httpClient.delete<User>(this.endpoint + "/users/" + id.toString(), { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  getAdminSettings(): Observable<AdminSettings> {
    const params = this.getDefaultParams();
    return this.httpClient.get<AdminSettings>(this.endpoint + '/profile/settings/', {
      headers: this.getDefaultHeaders(),
      params
    }).pipe(
      catchError(error => this.handleError(error)));
  }

  updateAdminSettings(settings: AdminSettings): Observable<AdminSettings> {
    const params = this.getDefaultParams();
    return this.httpClient.put<AdminSettings>(this.endpoint + '/profile/settings/', settings, {
      headers: this.getDefaultHeaders(),
      params
    }).pipe(
      catchError(error => this.handleError(error)));
  }

   /** AUDIT **/

  getAuditLog(): Observable<AuditLogEntry[]> {
    const params = this.getDefaultParams();

    return this.httpClient.get(this.endpoint + '/admin/audit', {
      headers: this.getDefaultHeaders(),
      params,
      responseType: 'text'
    })
      .pipe(
        map((csv) => {
          const rows = this.papa.parse(csv).data;
          const result: AuditLogEntry[] = [];
          if (rows.length > 0) {

            // find column mapping indices
            const index = new Map();
            const header = rows[0];
            for (let i = 0; i < header.length; i++) {
              index.set(header[i], i);
            }

            // map the values to the respective field
            for (let i = 1; i < rows.length; i++) {
              const entry = rows[i];
              if (entry.length == header.length) {
                result.push({
                  id: entry[index.get('id')],
                  timestamp: entry[index.get('timestamp')],
                  username: entry[index.get('username')],
                  action: entry[index.get('action')],
                  data: entry[index.get('data')] ? JSON.parse(entry[index.get('data')]) : null,
                  details: entry[index.get('details')]
                });
              }
            }
          }
          return result;
        }),
        catchError(error => this.handleError(error)));
  }

  /** CONTENT */

  getContent(game_language_id: number, reference_language_id: number): Observable<KeyValuePair[]> {
    //"key", "value", "sort_id", "base_value", "reference_value", "default_value", "category", "style", "label"
    let params = this.getDefaultParams().set("reference_language_id", reference_language_id.toString());
    return this.httpClient.get(this.endpoint + "/game_languages/" + game_language_id.toString() + "/content", {
      headers: this.getDefaultHeaders(),
      params: params,
      responseType: 'text'
     })
      .pipe(
        map((csv) => {
          const rows = this.papa.parse(csv).data;
          const result: KeyValuePair[] = [];
          if (rows.length > 0) {

            // find column mapping indices
            const index = new Map();
            const header = rows[0];
            for (let i = 0; i < header.length; i++) {
              index.set(header[i], i);
            }

            // map the values to the respective field
            for (let i = 1; i < rows.length; i++) {
              const entry = rows[i];
              if (entry.length == header.length) {
                result.push({
                  key: entry[index.get('key')],
                  value: entry[index.get('value')],
                  sort_id: entry[index.get('sort_id')],
                  base_value: entry[index.get('base_value')],
                  reference_value: entry[index.get('reference_value')],
                  category: entry[index.get('category')],
                  style: entry[index.get('style')],
                  label: entry[index.get('label')]
                });
              }
            }
          }
          return result;
        }),
        catchError(error => this.handleError(error)));
  }

  updateContent(game_language_id: number, content: KeyValuePair[]): Observable<KeyValuePair[]> {
    let params = this.getDefaultParams();
    return this.httpClient.post<KeyValuePair[]>(this.endpoint + "/game_languages/" + game_language_id.toString() + "/content", content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  addPair(game_id: number, content: KeyValuePair[]): Observable<KeyValuePair[]> {
    let params = this.getDefaultParams();
    return this.httpClient.post<KeyValuePair[]>(this.endpoint + "/games/" + game_id.toString() + "/pairs", content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }

  removePair(game_id: number, content: KeyValuePair[]): Observable<KeyValuePair[]> {
    let params = this.getDefaultParams();
    return this.httpClient.patch<KeyValuePair[]>(this.endpoint + "/games/" + game_id.toString() + "/pairs", content, { headers: this.getDefaultHeaders(), params: params }).pipe(
      catchError(error => this.handleError(error)));
  }
}
