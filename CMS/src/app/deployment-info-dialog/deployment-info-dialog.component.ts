import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class DeploymentInfoData {
  text: string;
  link: string;
  objectName: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './deployment-info-dialog.component.html',
  styleUrls: ['./deployment-info-dialog.component.css']
})

export class DeploymentInfoDialogComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: DeploymentInfoData) { }

  ngOnInit() {
  }

  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  openLink (url: string) {
    window.open(url.substring(0, url.length - 1) + "&testmode=1", "_blank");
  }
}