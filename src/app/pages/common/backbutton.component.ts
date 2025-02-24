import { Location } from '@angular/common';
import { Component } from '@angular/core';
@Component({
    selector: 'BackButton',
    template: `<button style="cursor:pointer;" id="BackBtn"  class="btn btn-warning BackBtn" (click)="this.location.back()">{{insText}}</button>`,

})

export class BackButtonComponent {
    insVisible = false;
    insText = "Back";
    insFormCnfgId;

    constructor(public location: Location) {


    }

}