import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Params, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {BackendService} from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(protected router: Router, protected backendService: BackendService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = this.backendService.getCurrentUser();
    if (currentUser) {
      return true;
    }

    this.redirectToLogin(next);
    return false;
  }

  protected redirectToLogin(next: ActivatedRouteSnapshot) {
    const params = {};
    params['returnUrl'] = this.mergeUrlSegments(next.url);
    for (const key of next.queryParamMap.keys) {
      params[key] = next.queryParamMap.get(key);
    }

    this.router.navigate(['/login'], {queryParams: params});
  }

  private mergeUrlSegments(segments: UrlSegment[]) {
    return segments.map(segment => segment.toString()).join('/');
  }

}
