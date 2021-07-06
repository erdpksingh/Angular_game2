import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from '../navigation.service';
import { BackendService } from '../backend.service';
import { Game } from '../game';
import { Router } from '@angular/router';
import { GameLanguage } from '../game-language';
import { Language } from '../language';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NotificationService } from '../notification.service';
import { NewGameDialogComponent, NewGameDialogData } from '../new-game-dialog/new-game-dialog.component';

@Component({
  selector: 'app-games-admin',
  templateUrl: './games-admin.component.html',
  styleUrls: ['./games-admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GamesAdminComponent implements OnInit {

  games: Game[];
  availableLanguages: Language[];

  newGameLanguageErrorState: ErrorStateMatcher = {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return !!(control && control.invalid && (control.dirty || control.touched));
    }
  }

  constructor(
    private translateService: TranslateService,
    private navigationService: NavigationService,
    private backendService: BackendService,
    private router: Router,
    public dialog: MatDialog,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.translateService.get("GAMES_ADMIN.TITLE").subscribe(value => this.navigationService.update(value, "/admin"));
    this.backendService.getAvailableLanguages().subscribe(languages => {
      this.availableLanguages = languages;
      this.backendService.getAdminGames().subscribe(games => this.getGames(games));
    });
  }

  private getGames(games: Game[]) {
    this.games = games;
    for (let game of games) {
      this.getGame(game);
    }
  }

  getGame(game: Game): void {
    console.log("getGame" + game.name);
    this.backendService.getAdminGameLanguage(game.id).subscribe(languages => {
      game.languages = languages;
      let usedLanguages = [];
      game.languages.forEach(gameLanguage => {
        this.translateService.get("GAME_LANGUAGE." + gameLanguage.language_id.toUpperCase())
          .subscribe(translatedLabel => gameLanguage.label = gameLanguage.language_id.toUpperCase() + " - " + translatedLabel);
          gameLanguage.is_base_language = (gameLanguage.label.toLowerCase().includes(game.base_language)) ? true : false;
        usedLanguages.push(gameLanguage.language_id);
      });
      game.availableLanguages = this.availableLanguages.filter(language => usedLanguages.indexOf(language.id) == -1);
    });
  }

  updateGame(game: Game): void {
    console.log("updateGame" + game.name);
    this.backendService.updateAdminGameLanguage(game).subscribe(game => {
      console.log("update successfull");
    });
  }

  openGameLanguage(gameLanguage: GameLanguage) {
    this.router.navigate(['./game-language/' + gameLanguage.id]);
  }

  deleteGame(game: Game) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: "30%",
      data: { objectName: game.name, question: "GAMES_ADMIN.CONFIRMATION_DELETE_GAME" }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteGame(game).subscribe(() => {
          this.backendService.getAdminGames().subscribe(games => this.getGames(games));
        });
      }
    });
  }
  deleteGameLanguage(game: Game, gameLanguage: GameLanguage) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: "30%",
      data: { objectName: game.name + " / " + gameLanguage.label, question: "GAMES_ADMIN.CONFIRMATION_DELETE_LANGUAGE" }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deleteGameLanguage(gameLanguage).subscribe(() => {
          this.getGame(game);
          this.notificationService.success("GAMES_ADMIN.SUCCESS_DELETE_LANGUAGE");
        });
      }
    });
  }

  onLanguageAdded(game: Game) {
    this.getGame(game);
    this.notificationService.success("GAMES_ADMIN.SUCCESS_ADD_LANGUAGE");
  }

  createNewGame() {
    let newGameInfo = new NewGameDialogData();
    newGameInfo.base_language = "en";
    newGameInfo.name = "new game";
    newGameInfo.objectName = "GAMES_ADMIN.NEW_GAME";

    const dialog = this.dialog.open(NewGameDialogComponent, {
      width: "30%",
      data: newGameInfo
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.addGame(newGameInfo.name, newGameInfo.base_language).subscribe((data_game) => {
          this.notificationService.success("GAMES_ADMIN.SUCCESS_CREATE_GAME");
    
          this.backendService.addGameLanguage(data_game.id, newGameInfo.base_language, "0").subscribe((data_language) => {
            this.notificationService.success("GAMES_ADMIN.SUCCESS_CREATE_LANGUAGE");
  
            this.backendService.getAdminGames().subscribe(games => this.getGames(games));
          });
        });
      }
    });
  }

}
