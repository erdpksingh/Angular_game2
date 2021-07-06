import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private titleSource = new BehaviorSubject<string>("");
  private backUrlSource = new BehaviorSubject<string>(null);
  private usernameSource = new BehaviorSubject<string>("");
  title = this.titleSource.asObservable();
  backUrl = this.backUrlSource.asObservable();
  username = this.usernameSource.asObservable();

  constructor(private router: Router) {
  }

  update(title: string, backUrl: string) {
    this.titleSource.next(title);
    this.backUrlSource.next(backUrl);
  }

  setUsername(username: string) {
    this.usernameSource.next(username);
  }

  goBack() {
    if (this.backUrlSource.getValue()) {
      this.router.navigate([this.backUrlSource.getValue()]);
    } else {
      this.router.navigate(["/"]);
    }
  }

}
