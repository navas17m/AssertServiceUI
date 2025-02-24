import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
//import {Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { UploadDocumentsDTO } from './DTO/uploaddocumentsdto';

@Component({
    selector: 'FinanceUpload-Documents',
    templateUrl: './financeuploaddocuments.component.template.html',
//     styles: [`[required]  {
//         border-left: 5px solid blue;
//     }

//     .ng-valid[required], .ng-valid.required  {
//             border-left: 5px solid #42A948; /* green */
// }
//     .ng-invalid:not(form)  {
//         border-left: 5px solid #a94442; /* red */
// }`],
})

export class FinanceUploadDocumentsComponet {
    public searchText: string = "";
    controllerName = "UploadDocuments";
    //submittedUpload = false;
    lstUploadedFiles = []; loading = false;
    arrUploadedFiles = [];
    saveText = "Upload";
    addParameter; documentTypeId; color = ""; UserTypeCnfgId; TypeId;
    objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    documentTypeList; personUploaded;
    intformCnfgId; intprimaryKeyId; visibleColor = false; visibleCopyDoc = true; documentId; isEdit = false;
    objUploadDocumentsDTO: UploadDocumentsDTO = new UploadDocumentsDTO();
    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;
    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }
    @Input()
    set formCnfgId(formId: any) {
        this.intformCnfgId = formId;
    }
    @Input()
    set userTypeCnfgId(UserTypeId: any) {
        this.UserTypeCnfgId = UserTypeId;
    }
    @Input()
    set typeId(TypeId: any) {
        this.TypeId = TypeId;
    }
    @Input()
    set primaryKeyId(primaryKeyId: any) {
        this.intprimaryKeyId = primaryKeyId;
    }

    @Input()
    get IsUpload(): boolean {
        return this.uploader.queue.length > 0 ? true : false;
    }

    @Input() submittedUpload;
    _uploadForm: FormGroup;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    constructor(private _formBuilder: FormBuilder,
        private modal: PagesComponent, private apiService: APICallService
    ) {
        this.objUploadDocumentsDTO.DocumentDate = null;
        this.personUploaded = Common.GetSession("UserName");
        this.uploader = new FileUploader({
            url: environment.api_uploadurl,
        });
    }

    public fnBindUploadDocs(UserTypeCnfgId, TypeId) {
        this.loading = true;
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.UserTypeCnfgId = UserTypeCnfgId;
        this.objUploadDocumentsDTO.Id = TypeId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        //  this._uploadServices.GetAllForCommon(this.objUploadDocumentsDTO).then(data => { this.lstUploadedFiles = data; });
        this.apiService.post(this.controllerName, "GetAllForFinCommon", this.objUploadDocumentsDTO).then(data => {
            this.lstUploadedFiles = data;
            this.loading = false;
        });
    }

    public fnUploadAll(tblPrimaryKey) {
        if (this.uploader.queue.length > 0) {
            this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.DocumentDate);

            this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
            this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
            this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
            this.objUploadDocumentsDTO.TblPrimaryKeyId = tblPrimaryKey;
            //let iscommon = this.objUploadDocumentsDTO.IsCommon == true ? "1" : "0";
            // let pwd = this.objUploadDocumentsDTO.Password == null ? "" : this.objUploadDocumentsDTO.Password;
            this.uploader.options.additionalParameter = {
                "addPar": this.objUploadDocumentsDTO.AgencyProfileId + "^"
                + this.objUploadDocumentsDTO.TblPrimaryKeyId + "^"
                + this.objUploadDocumentsDTO.FormCnfgId + "^" + "0" + "^"
                + "0" + "^" + this.objUploadDocumentsDTO.UserProfileId + "^"
                + "0" + "^" + "0" + "^" + "0" + "^" + "0" + "^" + this.UserTypeCnfgId + "^" + this.TypeId + "^"
                + false + "^" + "0" + "^" + false + "^" + "0" + "^" + null
                + "^" + this.objUploadDocumentsDTO.DocumentDate
            };
            this.uploader.uploadAll();
			this.uploader.onCompleteAll = () => {
				this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateEditFormat(this.objUploadDocumentsDTO.DocumentDate);
                this.fnBindUploadDocs(this.UserTypeCnfgId, this.TypeId);
                this.uploader.clearQueue();
                this.modal.alertSuccess(Common.GetUploadSuccessfullMsg);
			 };
            //this.uploader.onProgressAll = (item: any) => {
               // this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateEditFormat(this.objUploadDocumentsDTO.DocumentDate);
              //  this.fnBindUploadDocs(this.UserTypeCnfgId, this.TypeId);
              //  this.uploader.clearQueue();
              //  this.modal.alertSuccess(Common.GetUploadSuccessfullMsg);
           // };
        }
        else
            this.modal.alertDanger(Common.GetSelectDocumentMsg);
    }
    fnDelete(Id) {
        //   if (confirm(Common.GetDeleteConfirmMsg)) {
        // this._uploadServices.DeleteDocument(Id).then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, Id).then(data => this.Respone(data));
        //  }
    }
    fnDownload(Id, FileName) {
        let agencyId = Common.GetSession("AgencyProfileId");
        window.location.href = environment.api_downloadurl + Id + "," + agencyId;
    }
    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.objUploadDocumentsDTO.DocumentDate = null;
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            this.fnBindUploadDocs(this.UserTypeCnfgId, this.TypeId);
        }
    }
}
