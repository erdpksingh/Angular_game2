import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from '../backend.service';
import { Language } from '../language';
import { EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export class NewGameDialogData {
  name: string;
  base_language: string;
  objectName: string;
}

@Component({
  selector: 'app-new-game-dialog',
  templateUrl: './new-game-dialog.component.html',
  styleUrls: ['./new-game-dialog.component.css']
})
export class NewGameDialogComponent implements OnInit {
  availableLanguages: Language[];
  selectedLanguage: Language;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: NewGameDialogData,
    private backendService: BackendService) { }

  ngOnInit() {
    this.backendService.getAvailableLanguages().subscribe(languages => {
      this.availableLanguages = languages;
      this.selectedLanguage = this.availableLanguages.find(x => x.id == "en");
    });    
  }

  ChangeLanguage() {
    console.log(this.selectedLanguage);
    this.data.base_language = this.selectedLanguage.id;
  }
}