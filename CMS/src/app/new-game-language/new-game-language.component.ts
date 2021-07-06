import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { Language } from '../language';
import { Game } from '../game';
import { BackendService } from '../backend.service';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-game-language',
  templateUrl: './new-game-language.component.html',
  styleUrls: ['./new-game-language.component.css']
})
export class NewGameLanguageComponent implements OnInit {

  @ViewChild("form", { static: true }) form;
  @Input() game: Game;
  @Output() languageAdded = new EventEmitter<Game>();

  public newLanguageForm: FormGroup;

  constructor(private backendService: BackendService) {

  }

  ngOnInit() {
    this.newLanguageForm = new FormGroup({
      newLanguage: new FormControl("", [Validators.required])
    });
  }

  public hasError = (control: string, error: string) => {
    return this.newLanguageForm.controls[control].hasError(error);
  }

  public addGameLanguage(formValue) {
    if (this.newLanguageForm.valid) {
      this.backendService.addGameLanguage(this.game.id, formValue.newLanguage.id, this.game.base_language).subscribe((data) => {
        this.languageAdded.next(this.game);
        this.form.resetForm();
      });
    }
  }

}
