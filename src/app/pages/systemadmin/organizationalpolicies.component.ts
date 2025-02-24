import { Component } from '@angular/core';

@Component({
    selector: 'organizationalpolicies',
    templateUrl: './organizationalpolicies.component.template.html',
})
export class OrganizationalPoliciesComponent {
    isAdmin = true;
    headerText = "Organisational Policies";
    objQeryVal;
    formConfigId = 18;
  
}