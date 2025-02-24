

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Common } from '../common';
import { CarerFamilyInfo } from './DTO/carerfamilyinfo';
@Component({
    selector: 'CarerFamily',
    templateUrl: './carerfamily.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//    .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//    label + .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`],
})

export class CarerFamilyComponet {
    _Form: FormGroup;
    objQeryVal;
    CarerId;
    objCarerFamilyInfo: CarerFamilyInfo = new CarerFamilyInfo;
    insCarerDetails;
    constructor(private _formBuilder: FormBuilder) {

        if (Common.GetSession("SelectedApplicantProfile") != "0" && Common.GetSession("SelectedApplicantProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
            this.CarerId = this.insCarerDetails.CarerId;
        }
      //  this.CarerId = Common.GetSession("CarerId");
        this._Form = _formBuilder.group({
        });
    }
}
