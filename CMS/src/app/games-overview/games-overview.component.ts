import { Component, OnInit } from '@angular/core';
import { Game } from '../game';
import { NavigationService } from '../navigation.service';
import { GameLanguage } from '../game-language';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../backend.service';
import { GamesAdminComponent } from '../games-admin/games-admin.component';

@Component({
  selector: 'app-games-overview',
  templateUrl: './games-overview.component.html',
  styleUrls: ['./games-overview.component.css']
})
export class GamesOverviewComponent implements OnInit {

  games: Game[];

  constructor(private navigationService: NavigationService, private router: Router, private translateService: TranslateService, private backendService: BackendService) {

  }

  ngOnInit() {
    this.translateService.get("GAMES_OVERVIEW.TITLE").subscribe(value => this.navigationService.update(value, null));
    this.backendService.getAuthorGames().subscribe(games => this.updateGames(games));
  }

  private updateGames(games: Game[]) {
    this.games = games;
    for (let game of games) {
      this.backendService.getAuthorGameLanguage(game.id).subscribe(languages => {
          game.languages = languages;
          game.languages.forEach(gameLanguage => {
            gameLanguage.is_base_language = (gameLanguage.language_id.toLowerCase().includes(game.base_language)) ? true : false;
          });
        });
    }
  }

  openGameLanguage(gameLanguage: GameLanguage) {
    this.router.navigate(['./game-language/' + gameLanguage.id]);
  }
}
