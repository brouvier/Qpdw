import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buzzer-qrcode',
	templateUrl: './buzzer-qrcode.component.html',
  styles: []
})
export class BuzzerQrcodeComponent implements OnInit {

  buzzerPadUrl: string = "";

  constructor() {}

  ngOnInit(): void {
    this.buzzerPadUrl = window.location.href.substring(0, 1 + window.location.href.lastIndexOf('/')) + "buzzer";
  }

}
