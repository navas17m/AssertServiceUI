import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';

@Component({
    selector: 'uploadformfdocuments',
    templateUrl: './uploadformfdocuments.component.template.html',
})
export class UploadFormFDocuments {
    @ViewChild('uploads') uploadCtrl;
    tblPrimaryKey;
    submittedUpload = false;
    objQeryVal;    
    //Doc
    formId;    
    TypeId;
    CarerParentId: number;

    constructor(private route: ActivatedRoute, private _router: Router, private pComponent: PagesComponent) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        
        if (this.objQeryVal.mid == 36 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 20]);
        }
        if (this.objQeryVal.mid == 37 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 20]);
        }
        if (this.objQeryVal.mid == 36) {
            this.formId = 69;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        } else if (this.objQeryVal.mid == 37) {
            this.formId = 41;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }
        //Doc
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = 0;

    }

    //clicksubmit(UploadDocIds, IsUpload, uploadFormBuilder) {
    //    if (uploadFormBuilder.valid) {
    //        this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
    //        this.pComponent.alertSuccess(Common.GetSaveSuccessfullMsg);
    //        this._router.navigate(['/pages/recruitment/redirect/6/' + this.objQeryVal.mid]);

    ////    }
    //}
}