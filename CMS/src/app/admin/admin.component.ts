import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavigationService} from '../navigation.service';
import {Router} from '@angular/router';
import {AuditLogEntry} from '../audit';
import {BackendService} from '../backend.service';
import {AdminSettings} from '../admin-settings';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  loading: boolean;
  auditLog: AuditLogEntry[];
  displayedColumns: string[] = ['timestamp', 'action', 'username'];
  adminSettings: AdminSettings = new AdminSettings();
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor(
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private router: Router,
    private backendService: BackendService) {
  }

  ngOnInit() {
    this.translateService.get('ADMIN.TITLE').subscribe(value => this.navigationService.update(value, null));
    this.backendService.getAdminSettings().subscribe(data => this.adminSettings = Object.assign(new AdminSettings(), data));
  }

  openGamesAdmin() {
    this.router.navigate(['./games-admin']);
  }

  openUsersAdmin() {
    this.router.navigate(['./users-admin']);
  }

  onOpenAuditLog(): void {
    if (!this.auditLog) {
      this.refreshAuditLog();
    }
  }

  refreshAuditLog(): void {
    this.loading = true;
    this.backendService.getAuditLog().subscribe(auditLogEntries => {
      this.auditLog = auditLogEntries;
    });
  }

  openAuditDetails(element: AuditLogEntry) {

  }

  onAdminSettingsChanged() {
    this.backendService
      .updateAdminSettings(this.adminSettings)
      .subscribe(data => this.adminSettings = Object.assign(new AdminSettings(), data));
  }
}
