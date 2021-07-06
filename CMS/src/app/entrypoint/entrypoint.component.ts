import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { UserRole } from '../user';

@Component({
  selector: 'app-entrypoint',
  templateUrl: './entrypoint.component.html',
  styleUrls: ['./entrypoint.component.css']
})
export class EntrypointComponent implements OnInit {

  constructor(private router: Router, private backendService: BackendService) { }

  ngOnInit() {
    let user = this.backendService.getCurrentUser();
    if(user) {
      if(user.role == UserRole.Admin) {
        this.router.navigate(["/admin"]);
      } else {
        this.router.navigate(["/games-overview"]);
      }
    }
  }

}
