import { Component, OnInit, ViewChild, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { User } from '../user';
import { Language } from '../language';
import { Game } from '../game';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from '../backend.service';
import { GameLanguage } from '../game-language';

@Component({
  selector: 'app-assign-game-language',
  templateUrl: './assign-game-language.component.html',
  styleUrls: ['./assign-game-language.component.css']
})
export class AssignGameLanguageComponent implements OnInit {

  @ViewChild("form", { static: true }) form;
  @Input() user: User;
  @Input() games: Game[] = [];
  @Input() availableGameLanguages: GameLanguage[];
  @Output() languageAdded = new EventEmitter<User>();

  public assignLanguageForm: FormGroup;

  public availableGames: Game[];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.assignLanguageForm = new FormGroup({
      newGame: new FormControl("", [Validators.required]),
      newLanguage: new FormControl("", [Validators.required])
    });
  }

  getUnassignedLanguagesFor(game: Game): GameLanguage[] {
    if (game && game.languages) {
      return game.languages.filter(gameLanguage => !this.userHasGameLanguage(gameLanguage));
    }
    return [];
  }

  private userHasGameLanguage(gameLanguage: GameLanguage): boolean {
    return this.user.gameLanguages.findIndex(userLanguage => userLanguage.id == gameLanguage.id) != -1;
  }

  public hasError = (control: string, error: string) => {
    return this.assignLanguageForm.controls[control].hasError(error);
  }

  public assignGameLanguage(formValue) {
    if (this.assignLanguageForm.valid) {
      this.backendService.addUserGameLanguage(formValue.newLanguage.id, this.user.id).subscribe((data) => {
        this.languageAdded.next(this.user);
        this.form.resetForm();
      });
    }
  }

  public gameSelectionChanged() {
    let newLanguage = this.assignLanguageForm.get("newLanguage");
    newLanguage.reset();
    newLanguage.markAsUntouched();
  }

}
