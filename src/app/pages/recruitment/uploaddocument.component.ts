import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';

@Component({
    selector: 'uploaddocuments',
    templateUrl: './uploaddocuments.component.template.html',
})
export class UploadDocuments {
    @ViewChild('uploads') uploadCtrl;
    tblPrimaryKey = 0;
    submittedUpload = false;
    objQeryVal;
    //Doc
    formId;
    TypeId;
    CarerParentId: number;
  

    constructor(private route: ActivatedRoute, private _router: Router, private modal: PagesComponent) {

        this.route.params.subscribe(data => this.objQeryVal = data);
      

        if (this.objQeryVal.mid == 3 && (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0")) {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 20]);
        }
        if (this.objQeryVal.mid == 13 && (Common.GetSession("CarerParentId") == null || Common.GetSession("CarerParentId") == "0")) {
            this._router.navigate(['/pages/recruitment/applicantlist', 13, 20]);
        }

        if (this.objQeryVal.mid == 3) {
            this.formId = 66;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        }
        else if (this.objQeryVal.mid == 13) {
            this.formId = 38;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
        }
        //Doc
        this.TypeId = this.CarerParentId;
        //this.tblPrimaryKey = this.CarerParentId;
    }

    //DocOk = true;
    //clicksubmit(UploadDocIds, IsUpload, uploadFormBuilder) {                

    //    if (uploadFormBuilder.valid) {
    //        this.uploadCtrl.fnUploadAll(this.CarerParentId);
    //        alert(Common.GetSaveSuccessfullMsg);
    //        this._router.navigate(['/pages/fostercarer/fcredirect/1/', this.objQeryVal.mid]);            
    //    }
    //}
}