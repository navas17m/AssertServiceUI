import { Component } from '@angular/core';
@Component({
    selector: 'carerfinancialguidelines',
    templateUrl: './carerfinancialguidelines.component.template.html',
})
export class CarerFinancialGuidelinesComponent {
    isAdmin = true;
    headerText = "Carer Financial Guidelines";
    objQeryVal;
    formConfigId = 21;    
}