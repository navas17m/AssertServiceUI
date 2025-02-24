
import { Component } from '@angular/core';

@Component({
    selector: 'handbook',
    templateUrl: './handbook.component.template.html',
})
export class HandBookComponent {   
    headerText = "Foster Carer Handbook";
    formConfigId = 20;
    isAdmin = true;
    constructor(  ) {
       
    }
}