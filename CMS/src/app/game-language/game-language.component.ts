import { Component, OnInit, Input, OnChanges, HostListener, Injectable, ViewEncapsulation, AfterContentChecked, AfterViewChecked, ViewChildren, QueryList, AfterViewInit, ElementRef } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { TranslateService } from '@ngx-translate/core';
import { BackendService } from '../backend.service';
import { ActivatedRoute, CanDeactivate } from '@angular/router';
import { Category, Entry, KeyValuePair } from '../content';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { Papa } from 'ngx-papaparse';
import { FileSaverService } from 'ngx-filesaver';
import { Game } from '../game';
import { GameLanguage, GameLanguageStatus } from '../game-language';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DeploymentInfoDialogComponent } from '../deployment-info-dialog/deployment-info-dialog.component';
import { ConfigService } from '../config.service';
import { NotificationService } from '../notification.service';

export enum Themes {
  white = 0,
  blue,
  red
}

enum Cars {
  AClass = 0,
  EQC,
  AMG,
  SLK,
  Smart,
  Vito
}

@Component({
  selector: 'app-game-language',
  templateUrl: './game-language.component.html',
  styleUrls: ['./game-language.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GameLanguageComponent implements OnInit {

  @ViewChildren("listitem") items: QueryList<ElementRef>;
  loading = true;
  pairAdded = false;
  id: number;
  game: Game;
  gameName: string;
  ingameName: string;
  gameLanguage: GameLanguage;
  otherLanguages: GameLanguage[];
  referenceLanguage: GameLanguage;
  pendingChanges: boolean = false;
  numberPairs: number = 0;

  theme_options : string[];
  Themes : typeof Themes = Themes;
  car_options : string[];
  Cars : typeof Cars = Cars;

  content: Map<string, KeyValuePair> = new Map();
  categories: Map<string, Category> = new Map([
    ["pairs", new Category("pair_", true)],
    ["generic", new Category("generic")],
    ["generic", new Category("gen_")],
    ["common", new Category("common")],
    ["common", new Category("com_")]
  ]);

  constructor(
    private navigationService: NavigationService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private backendService: BackendService,
    public dialog: MatDialog,
    private papa: Papa,
    private fileSaver: FileSaverService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.pairAdded = false;
    var theme_options = Object.keys(Themes);
    this.theme_options = theme_options.slice(theme_options.length / 2);
    var car_options = Object.keys(Cars);
    this.car_options = car_options.slice(car_options.length / 2);

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.backendService.getGameLanguage(this.id).subscribe(gameLanguage => {
      this.gameLanguage = gameLanguage;
      this.backendService.getGame(gameLanguage.game_id).subscribe(game => {
        this.game = game;
        this.translateService.get(game.name.toUpperCase()).subscribe(translatedGameName => {
          this.gameName = translatedGameName;
          this.translateService.get("GAME_LANGUAGE." + gameLanguage.language_id.toUpperCase())
            .subscribe(translatedLabel => {
              gameLanguage.label = translatedLabel;
              if (this.isAdmin()) {
                this.navigationService.update(this.getGameLanguageLabel(), "/games-admin")
              } else {
                this.navigationService.update(this.getGameLanguageLabel(), "/games-overview")
              }
            });
          this.backendService.getAdminGameLanguage(gameLanguage.game_id).subscribe(languages => {
            this.otherLanguages = languages;
            this.referenceLanguage = languages.find(language => language.language_id == this.game.base_language);
            this.backendService.getContent(this.id, this.getReferenceLanguageId()).subscribe(content => this.parseContent(content));
          });
        });
      });

    });
  }

  parseValue(value : string) {
    var myValue = Themes[value];
    console.log(myValue);
  }

  isSubmitted(): boolean {
    return this.gameLanguage.status == GameLanguageStatus.Submitted;
  }

  isAdmin(): boolean {
    return this.backendService.isAdmin();
  }

  canDeploy(): boolean {
    return this.isSubmitted() && this.isAdmin();
  }

  onValueChanged() {
    this.setPendingChanges(true);
  }

  onChangeReferenceLanguage() {
    this.reloadValues();
  }

  getReferenceLanguageId() {
    return this.referenceLanguage ? this.referenceLanguage.id : null;
  }

  setPendingChanges(pendingChanges: boolean) {
    this.pendingChanges = pendingChanges;
  }

  reloadValues() {
    this.backendService.getContent(this.id, this.getReferenceLanguageId()).subscribe(content => {
      this.updateContent(content, true);
      this.setPendingChanges(false);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.pendingChanges) {
      $event.returnValue = true;
    }
  }

  afterRender() {
    this.loading = false;
  }

  parseContent(content: KeyValuePair[]): void {

    // check when all items have been rendered
    this.items.changes.subscribe(() => {
      if (this.items.length == content.length) {
        setTimeout(() => this.afterRender(), 2000);
      }
    });
    let counter = 0;
    content.forEach(keyValuePair => {
      this.content.set(keyValuePair.key, keyValuePair);
      if (this.categories.has(keyValuePair.category)) {

        let category = this.categories.get(keyValuePair.category);
        let key = keyValuePair.key;

        let parts = key.split("_");
        let levels = [0, 0, 0, 0];
        for (let level = 0; level < Math.min(parts.length / 2, 4); level++) {
          levels[level] = (Number.parseInt(parts[level * 2 + 1])) + 1;
        }

        keyValuePair.hierarchy_indices = {
          0: levels[0],
          1: levels[1],
          2: levels[2],
          3: levels[3]
        };

        if (category.entry_prefix && key.startsWith(category.entry_prefix)) {
          let index = levels[0] - 1;
          let entry = category.getEntry(index);

          keyValuePair.key_partial = parts.slice(2).join("_");
          if(keyValuePair.key.includes("pair")) counter++;
          entry.values.push(keyValuePair);
        } else {
          category.values.push(keyValuePair);
        }
      }
      this.numberPairs = counter / 3;
    });

    this.ingameName = this.content.get("name").value;
  }

  updateContent(content: KeyValuePair[], updateBaseAndReference = false) {
    content.forEach(keyValuePair => {
      if (this.content.has(keyValuePair.key)) {
        let entry: KeyValuePair = this.content.get(keyValuePair.key);
        if (this.gameLanguage.is_base_language || entry.style == "default") {
          entry.value = keyValuePair.value;
          if (updateBaseAndReference) {
            entry.reference_value = keyValuePair.reference_value;
            entry.base_value = keyValuePair.base_value;
          }
        }
      }
    });
  }

  openImportDialog(event): void {
    if (event.target.files && event.target.files.length > 0) {
      const dialog = this.dialog.open(ImportDialogComponent, {
        data: event.target.files[0]
      });

      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.updateContent(result);
          this.setPendingChanges(true);
          this.notificationService.success("GAME_LANGUAGE.SUCCESS_IMPORT");
        }
      });
    }
  }

  exportContent() {
    let rows = [];
    this.content.forEach((value, key) => {
      rows.push([key, value.value]);
    })

    let csvData = this.papa.unparse(rows, { delimiter: "," });

    let blob = new Blob([csvData], { type: "text/plain;charset=utf-8" });
    this.fileSaver.save(blob, this.getExportFileName());
  }


  addPair(language: GameLanguage, category: Category): void {
    console.log(this.pairAdded);
    if(!this.pairAdded) {
      const dialog = this.dialog.open(ConfirmationDialogComponent, {
        data: { objectName: this.getGameLanguageLabel(), question: "GAME_LANGUAGE.CONFIRMATION_ADD_PAIR" }
      });

      dialog.afterClosed().subscribe(result => {
        if (result) {
          this.addPairToGame(language, category);
        }
      });
    } else {
      this.addPairToGame(language, category);
    }
  }

  valueAscOrder = (a: KeyValuePair, b: KeyValuePair): number => {
    return (a.sort_id - b.sort_id);
  }

  addPairToGame(language: GameLanguage, category: Category) {
    let lastentry = category.entries[category.entries.length - 1];
    let count = lastentry.id + 1;

    let entry = category.getEntry(count);
    let newPairValues: KeyValuePair[] = [];

    let number = count + 1;
    let sortbase = 100 + count*3;
    let title = { key: "pair_" + count, key_partial: "title", value: "New pair " + number, category: "pairs",
      style: "default", label: "PAIR_TITLE", base_value: "no name", hierarchy_indices: {0: NaN, 1: 0, 2: 0, 3: 0}, reference_value: "no name", sort_id: sortbase + 10};
    let pair1 = { key: "pair_" + count + "_option_0", key_partial: "option_0", value: "Text 1", category: "pairs",
      style: "default", label: "PAIR_TEXT_1", base_value: "no name", hierarchy_indices: {0: NaN, 1: 0, 2: 0, 3: 0} , reference_value: "no name", sort_id: sortbase + 11};
    let pair2 = { key: "pair_" + count + "_option_1", key_partial: "option_1", value: "Text 2", category: "pairs",
      style: "default", label: "PAIR_TEXT_2", base_value: "no name", hierarchy_indices: {0: NaN, 1: 0, 2: 0, 3: 0} , reference_value: "no name", sort_id: sortbase + 12};

    entry.values.push(title);
    entry.values.push(pair1);
    entry.values.push(pair2);
    console.log(entry);
    newPairValues.push(title);
    newPairValues.push(pair1);
    newPairValues.push(pair2);
    this.content.set(title.key, title);
    this.content.set(pair1.key, pair1);
    this.content.set(pair2.key, pair2);
    console.log(category);

    this.backendService.addPair(language.game_id, newPairValues).subscribe(() => {
      this.notificationService.success("GAME_LANGUAGE.PAIR_ADDED");
      this.numberPairs++;
      this.pairAdded = true;
    });
  }

  removePair(language: GameLanguage, entry: Entry, category: Category) {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: { objectName: this.getGameLanguageLabel(), question: "GAME_LANGUAGE.CONFIRMATION_REMOVE_PAIR" }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        let newPairValues: KeyValuePair[] = [];

        let key = entry.prefix;
        let title = { key: key, key_partial: "title", value: "title", category: "pairs" };
        let pair1 = { key: key + "_option_0", key_partial: "option_0", value: "option 1", category: "pairs" };
        let pair2 = { key: key + "_option_1", key_partial: "option_1", value: "option 2", category: "pairs" };

        newPairValues.push(title);
        newPairValues.push(pair1);
        newPairValues.push(pair2);
        this.content.delete(key);
        this.content.delete(key + "_option_0");
        this.content.delete(key + "_option_1");
        category.removeEntry(entry);

        console.log(entry);

        let contentarray = this.contentToArray();
        this.updateContent(contentarray, true);

        this.backendService.removePair(language.game_id, newPairValues).subscribe(() => {
          this.notificationService.success("GAME_LANGUAGE.PAIR_REMOVED");
          this.numberPairs--;
        });
      }
    });
  }

  getExportFileName(): string {
    return this.gameLanguage.game_name.toLowerCase().replace(" ", "_") + "_" + this.gameLanguage.language_id.toLowerCase() + ".csv";
  }

  getGameLanguageLabel(): string {
    return this.gameName + " (" + this.gameLanguage.label + ")";
  }

  save() {

    const newContent = this.contentToArray();

    this.backendService.updateContent(this.id, newContent).subscribe(() => {
      this.setPendingChanges(false);
      this.notificationService.success("GAME_LANGUAGE.SUCCESS_SAVE");
      this.saved();
    });
  }

  saved() {
    this.setPendingChanges(false);
    this.ingameName = this.content.get("name").value;
  }


  test() {
    var previewWindow = window.open("",
      'targetWindow',
      'toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=1024, height=768');
    this.backendService.deployGameLanguageTest(this.gameLanguage).subscribe(() => this.openPreview(previewWindow));
  }

  contentToArray(): KeyValuePair[] {
    let rows: KeyValuePair[] = [];
    this.content.forEach((value, key) => {
      rows.push(value);
    });
    return rows;
  }

  openPreview(previewWindow: Window) {
    let appURL = ConfigService.settings.combo_racer_url;

    //let assetURLParam = ConfigService.settings.combo_racer_url;
    let id = this.gameLanguage.game_id;
    let testdeployment = "1";
    let languageParam = this.gameLanguage.language_id;
    let testmodeParam = "1";

    let callURL = appURL + "?cms_content_id=" + id + "&testdeployment=" + testdeployment + "&language=" + languageParam + "&testmode=" + testmodeParam;
    previewWindow.location.href = callURL;
  }

  cancel(): void {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: { objectName: this.getGameLanguageLabel(), question: "GAME_LANGUAGE.CONFIRMATION_DISCARD_PENDING_CHANGES" }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.reloadValues();
      }
    });
  }

  submit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = "80%";
    dialogConfig.data = { objectName: this.getGameLanguageLabel(), question: "GAME_LANGUAGE.CONFIRMATION_SUBMIT_LANGUAGE",  };

    const dialog = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.submitGameLanguage(this.gameLanguage).subscribe(
          gameLanguage => {
            this.gameLanguage.status = gameLanguage.status;
            this.notificationService.success("GAME_LANGUAGE.SUCCESS_SUBMIT");
          });
      }
    });
  }

  reject() {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      data: { objectName: this.getGameLanguageLabel(), question: "GAME_LANGUAGE.CONFIRMATION_REJECT_LANGUAGE" }
    });

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.rejectGameLanguage(this.gameLanguage).subscribe(gameLanguage => {
          this.gameLanguage.status = gameLanguage.status;
          this.notificationService.success("GAME_LANGUAGE.SUCCESS_REJECT");
        });
      }
    });
  }

  deploy() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = "80%";
    dialogConfig.data = { objectName: this.getGameLanguageLabel(), question: "GAME_LANGUAGE.CONFIRMATION_DEPLOY_LANGUAGE",  };

    const dialog = this.dialog.open(ConfirmationDialogComponent, dialogConfig);

    dialog.afterClosed().subscribe(result => {
      if (result) {
        this.backendService.deployGameLanguage(this.gameLanguage).subscribe(gameLanguage => {
          this.gameLanguage.status = gameLanguage.status;
          this.notificationService.success("GAME_LANGUAGE.SUCCESS_DEPLOY");

          let gameURL = ConfigService.settings.combo_racer_url + "?cms_content_id=" + this.game.id + "&"; // add game id

          const dialogConfig2 = new MatDialogConfig();
          dialogConfig2.maxWidth = "80%";
          dialogConfig2.data = { objectName: "Deployment", text: "GAMES_ADMIN.CONFIRMATION_DEPLOY_GAME", link : gameURL };

          const dialog = this.dialog.open(DeploymentInfoDialogComponent, dialogConfig2);
        });
      }
    });
  }
}

@Injectable()
export class CanDeactivateGameLanguage implements CanDeactivate<GameLanguageComponent> {

  question: string;

  constructor(private translateService: TranslateService) {
    this.translateService.get("GAME_LANGUAGE.CONFIRMATION_DISCARD_PENDING_CHANGES").subscribe(value => this.question = value);
  }
  canDeactivate(component: GameLanguageComponent): boolean {
    if (component.pendingChanges) {
      if (confirm(this.question)) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
