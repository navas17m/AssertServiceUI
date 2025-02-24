import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarerFamilyInfo } from './DTO/carerfamilyinfo';
@Component({
    selector: 'BackUpCarerFamily',
    providers: [],
    templateUrl: './backupcarerfamily.component.template.html',
    styles: [`[required]  {
        border-left: 5px solid blue;
    }

   .ng-valid[required], .ng-valid.required  {
            border-left: 5px solid #42A948; /* green */
}
   label + .ng-invalid:not(form)  {
        border-left: 5px solid #a94442; /* red */
}`],
})



export class BackupCarerFamilyComponet {
    _Form: FormGroup;
    objQeryVal;
    CarerId;
    objCarerFamilyInfo: CarerFamilyInfo = new CarerFamilyInfo;
    constructor(private _formBuilder: FormBuilder,private activatedroute: ActivatedRoute, private _router: Router) {

        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });
      //  this.objCarerFamilyInfo.CarerParentId

        this.CarerId = this.objQeryVal.Id;

        this._Form = _formBuilder.group({

        });
    }
}
