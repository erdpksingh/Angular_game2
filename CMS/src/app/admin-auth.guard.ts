import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from './user';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private router: Router, private backendService: BackendService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = this.backendService.getCurrentUser();
    if (currentUser) {
      if (currentUser.role == UserRole.Admin) {
        return true;
      } else {
        this.router.navigate(["/"]);
        return false;
      }
    }

    let username = next.paramMap.get("username");
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url, username: username } });
    return false;
  }

}
