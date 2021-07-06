import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { KeyValuePair } from '../content';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
})
export class ImportDialogComponent implements OnInit {

  loading: boolean = true;
  success: boolean = false;
  errorDetails: string = "DIALOG.IMPORT.ERROR_UNKNOWN";
  public content: KeyValuePair[] = [];

  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    private translateService: TranslateService,
    private papa: Papa,
    @Inject(MAT_DIALOG_DATA) public file: File
  ) { }

  ngOnInit() {
    this.loadTranslationFile();
    setTimeout(() => {

    }, 3000);
  }

  loadTranslationFile(): any {
    this.papa.parse(this.file, {
      encoding: "utf-8",
      complete: results => {
        let content: KeyValuePair[] = [];
        for (let entry of results.data) {
          if (entry.length == 2 && entry[0].length) {
            content.push({ key: entry[0], value: entry[1], category: "" });
          }
        }
        if (content.length) {
          this.content = content;
          this.success = true;
        } else {
          this.errorDetails = "DIALOG.IMPORT.ERROR_EMPTY";
        }
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
