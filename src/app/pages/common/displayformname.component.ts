import { Component, Input } from '@angular/core';
import { APICallService } from '../services/apicallservice.service';
declare var $: any;

@Component({
    selector: 'DisplayFormName',
    template: `{{formName}}`,
})

export class DisplayformnameComponent {   
    formName;

    @Input()
    set FormCnfgId(value: any) {        
        this.GetFormName(value);
    }
    constructor(private apiService: APICallService) {       
      
    }
    GetFormName(FormId) {
        this.apiService.get("MenuCnfg", "GetFormName", FormId).then(data => {
            this.formName = data;
        });
    }
}