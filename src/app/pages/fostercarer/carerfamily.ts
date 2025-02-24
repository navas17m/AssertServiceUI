

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Common } from '../common';
import { CarerFamilyInfo } from '../recruitment/DTO/carerfamilyinfo';

@Component({
    selector: 'FCCarerFamily',
    template: `<form [formGroup]="_Form">
               <div class="col-xl-12 col-lg-12 col-12 bottom-30">
                   <ApprovedCarerHeader></ApprovedCarerHeader>
                </div>
              <Familyinfo #Familyinfo [CarerId]="CarerId" [IsAllowInsert]="true"></Familyinfo>
             </form>`,
})
export class FCCarerFamilyComponet {

    _Form: FormGroup;
    objQeryVal;
    CarerId;
    objCarerFamilyInfo: CarerFamilyInfo = new CarerFamilyInfo;
    insCarerDetails;
    constructor(private _formBuilder: FormBuilder) {

        if (Common.GetSession("SelectedCarerProfile") != "0" && Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.CarerId = this.insCarerDetails.CarerId; 
        }

     
        this._Form = _formBuilder.group({

        });
    }
}