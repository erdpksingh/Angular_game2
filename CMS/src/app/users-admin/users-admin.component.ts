import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from '../navigation.service';
import { BackendService } from '../backend.service';
import { User } from '../user';
import { Language } from '../language';
import { Game } from '../game';
import { GameLanguage } from '../game-language';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-users-admin',
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersAdminComponent implements OnInit {

  @ViewChild("form", { static: true }) form;
  games: Game[];
  users: User[];
  roles = [0, 1];
  availableLanguages: Language[];

  public newUserForm: FormGroup;

  constructor(
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private backendService: BackendService,
    public dialog: MatDialog,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.newUserForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      role: new FormControl("", [Validators.required])
    });

    this.translateService.get("USERS_ADMIN.TITLE").subscribe(value => this.navigationService.update(value, "/admin"));
    this.backendService.getAdminGames().subscribe(games => {
      this.games = games;
      console.log(games)
      this.games.forEach(game => this.updateGame(game));
    });
    this.updateUsers();
    this.backendService.getAvailableLanguages().subscribe(languages => this.availableLanguages = languages);
  }

  updateGame(game: Game): void {
    this.backendService.getAdminGameLanguage(game.id).subscribe(languages => {
      game.languages = languages;
    });
  }

  onLanguageAdded(user: User) {
    this.updateUser(user);
    this.notificationService.success("USERS_ADMIN.SUCCESS_ADD_PERMISSION");
  }

  deleteUserGameLanguage(user: User, gameLanguage: GameLanguage) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: { objectName: user.username + "\n" + gameLanguage.game_name + " / " + gameLanguage.label, question: "USERS_ADMIN.CONFIRMATION_DELETE_LANGUAGE_ASSIGNMENT" }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteUserGameLanguage(user.id, gameLanguage.id).subscribe(() => {
          this.updateUser(user);
          this.notificationService.success("USERS_ADMIN.SUCCESS_REMOVE_PERMISSION");
        });
      }
    });
  }

  private updateUsers() {
    this.backendService.getUsers().subscribe(users => {
      this.users = users;
      this.users.forEach(user => this.updateUser(user));
    });
  }

  updateUser(user: User): any {
    this.backendService.getUserGameLanguages(user.id).subscribe(languages => {
      user.gameLanguages = languages;
      user.gameLanguages.forEach(gameLanguage => {
        this.translateService.get("GAME_LANGUAGE." + gameLanguage.language_id.toUpperCase())
          .subscribe(translatedLabel => gameLanguage.label = gameLanguage.language_id.toUpperCase() + " - " + translatedLabel);
        // this.translateService.get("GAMES." + gameLanguage.game_name + "_SHORT")
        //   .subscribe(translatedGame => gameLanguage.game_name = translatedGame);
      });
    });
  }

  public hasError = (control: string, error: string) => {
    return this.newUserForm.controls[control].hasError(error);
  }

  addNewUser(formValue) {
    if (this.newUserForm.valid) {
      this.backendService.addUser(formValue.userName, formValue.role).subscribe(user => {
        this.form.resetForm();
        this.updateUsers();
        this.notificationService.success("USERS_ADMIN.SUCCESS_ADD_USER");
      });
    }
  }

  cancelEditUser(user: User) {
    this.updateUsers();
  }

  editUser(user: User) {
    this.backendService.updateUser(user).subscribe(() => this.updateUsers());
  }

  deleteUser(user: User) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: { objectName: user.username, question: "USERS_ADMIN.CONFIRMATION_DELETE_USER" }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteUser(user.id).subscribe(() => {
          this.updateUsers();
          this.notificationService.success("USERS_ADMIN.SUCCESS_DELETE_USER");
        });
      }
    });
  }
}
