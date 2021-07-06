import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title: string;
  showBack: boolean;
  username: string;

  constructor(private navigationService: NavigationService, private backendService: BackendService) {

  }

  ngOnInit() {
    if (this.backendService.getCurrentUser()) {
      this.username = this.backendService.getCurrentUser().username;
    }
    this.navigationService.title.subscribe(title => this.title = title);
    this.navigationService.backUrl.subscribe(backUrl => this.showBack = backUrl != null);
    this.navigationService.username.subscribe(username => this.username = username);
  }

  goBack() {
    this.navigationService.goBack();
  }

}
