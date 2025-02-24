import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';

@Component({
    selector: 'uploaddocuments',
    templateUrl: './uploaddocuments.component.template.html',
})
export class UploadDocuments {  
    @ViewChild('upload') uploadCtrl;  
    formId;
    tblPrimaryKey = 0;
    submittedUpload = false;
    objQeryVal;
    TypeId;
    constructor(private modal: PagesComponent, private _router: Router, private route: ActivatedRoute) {       
        this.route.params.subscribe(data => this.objQeryVal = data);

        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.TypeId = parseInt(Common.GetSession("ReferralChildId"));  
                this.formId = 76;             
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/uploaddocuments/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.TypeId = parseInt(Common.GetSession("ChildId")); 
                this.formId = 101;              
            }
            else {
                Common.SetSession("UrlReferral", "pages/child/childuploaddocuments/4");
                this._router.navigate(['/pages/child/childprofilelist/0/4']);
            }
        }       
        
    }
   
}