import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vote-qrcode',
	templateUrl: './vote-qrcode.component.html',
  styles: []
})
export class VoteQrcodeComponent implements OnInit {

  votePadUrl: string = "";

  constructor() {}

  ngOnInit(): void {
    this.votePadUrl = window.location.href.substring(0, 1 + window.location.href.lastIndexOf('/')) + "votePad";
  }

}
