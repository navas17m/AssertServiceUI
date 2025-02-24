import { Component } from '@angular/core';

@Component({
    selector: 'PanelGuidelines',
    templateUrl: './panelguidelines.component.template.html',
})
export class PanelGuidelinesComponent {
    headerText = "Panel Guidelines";
    formConfigId = 193;
    isAdmin = true;
    constructor() {

    }
}