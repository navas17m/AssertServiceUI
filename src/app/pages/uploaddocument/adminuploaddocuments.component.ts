import { AfterViewInit, Component, Input } from '@angular/core';
//import { ConfigTableValuesService} from '../services/configtablevalues.service';
//import { UploadDocumentsService } from '../services/uploaddocuments.service';
//import { ConfigTableNames } from '../configtablenames';
//import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
//import {Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UploadDocumentsDTO } from './DTO/uploaddocumentsdto';
import { AgencyKeyNameValueCnfgDTO } from '../superadmin/DTO/agencykeynamecnfgdto';
@Component({
    selector: 'UploadAdmin-Documents',
    templateUrl: './adminuploaddocuments.component.template.html',
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

export class AdminUploadDocumentsComponet implements AfterViewInit {
    public searchText: string = "";
    controllerName = "UploadDocuments"; loading = false;
    //submittedUpload = false;
    objAgencyKeyNameValueCnfgDTO: AgencyKeyNameValueCnfgDTO = new AgencyKeyNameValueCnfgDTO();
    lstUploadedFiles = [];
    arrUploadedFiles = [];
    saveText = "Upload";
    addParameter; documentTypeId; userName;
    DocumentTypeId:number;
    //  objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    documentTypeList;
    submittedUpload = false;
    intformCnfgId;
    AgencyProfileId;
    IsVisibleDateOfUploaded=true;
    insAccessFormcnfgId; documentId; IsSaveMode = true; IsAdmin; GridHeader;
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
        this.insAccessFormcnfgId = formId;
        this.fnCheckDateofUploadVisible();

    }

    @Input()
    set AccessFormCnfgId(formId: any) {
        this.insAccessFormcnfgId = formId;
        this.fnCheckDateofUploadVisible();
    }

    @Input()
    set isAdmin(isAdmin: boolean) {
        this.IsAdmin = isAdmin;
    }
    @Input()
    set gridHeader(text: any) {
        this.GridHeader = text;
    }
    _uploadForm: FormGroup;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    constructor(private _formBuilder: FormBuilder, private modal: PagesComponent,
        private apiService: APICallService) {
        this.DocumentTypeId=0;
        this.objUploadDocumentsDTO.ExpiryDate = null;
        this.objUploadDocumentsDTO.DocumentDate=null;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.userName = Common.GetSession("UserName");
        this.uploader = new FileUploader({
            url: environment.api_uploadurl,
        });

        this._uploadForm = this._formBuilder.group({
            Title: ['', Validators.required],
            Description: ['', Validators.required],
            ExpiryDate: [],
            DocumentDate:[],
        });



    }

    fnCheckDateofUploadVisible()
    {
      //  console.log("this.intformCnfgId "+this.intformCnfgId);
      //  console.log("this.insAccessFormcnfgId "+this.insAccessFormcnfgId);

        if(this.insAccessFormcnfgId==134 ||this.intformCnfgId==132 ||this.insAccessFormcnfgId==133 ||this.insAccessFormcnfgId==131
            ||this.insAccessFormcnfgId==194 ||this.insAccessFormcnfgId==195)
        {
            //Get New Review Agency Config Value
            this.objAgencyKeyNameValueCnfgDTO.AgencyProfileId = this.AgencyProfileId;
            this.objAgencyKeyNameValueCnfgDTO.AgencyKeyNameCnfgId = 17;

            this.apiService.post("AgencyKeyNameCnfg", "GetById", this.objAgencyKeyNameValueCnfgDTO).then(data => {
                this.objAgencyKeyNameValueCnfgDTO = data;

                if (this.objAgencyKeyNameValueCnfgDTO.Value !=null && this.objAgencyKeyNameValueCnfgDTO.Value == "0")
                {
                    this.IsVisibleDateOfUploaded=false;
                }
            });
        }
    }

    ngAfterViewInit() {
        this.fnBindUploadDocs();
    }
    fnBindUploadDocs() {
        this.loading = true;
        this.objUploadDocumentsDTO.ExpiryDate = null;
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        // this._uploadServices.GetAll(this.objUploadDocumentsDTO).then(data => { this.lstUploadedFiles = data; });
        this.apiService.post(this.controllerName, "GetAll", this.objUploadDocumentsDTO).then(data => {
            this.lstUploadedFiles = data;
            this.loading = false;
        });
    }
    public SetSearchClear() {
        this.objUploadDocumentsDTO.FromDate=null;
        this.objUploadDocumentsDTO.ToDate=null;
        this.objUploadDocumentsDTO.DocumentTypeId=0;
        this.fnBindUploadDocs();
    }

    public SetSearchFromDate(val:any) {

        this.objUploadDocumentsDTO.FromDate = val;
        this.fnBindUploadDocs();
    }

    public SetSearchToDate(val:any) {

        this.objUploadDocumentsDTO.ToDate = val;
        this.fnBindUploadDocs();
    }

    public SetSearchFromToDate(val:any) {

        this.objUploadDocumentsDTO.FromDate = val.split('/')[0];
        this.objUploadDocumentsDTO.ToDate = val.split('/')[1];
        this.fnBindUploadDocs();
    }
    public SetFormcnfgId(FormId) {
        this.intformCnfgId = FormId;
    }

    public SetDocumentTypeId(TypeId) {
        this.DocumentTypeId = TypeId;
    }

    public GetByDocumentTypeId(DocumentTypeId) {

        this.loading = true;
        this.objUploadDocumentsDTO.ExpiryDate = null;
               // this.objUploadDocumentsDTO.FromDate = null;
        //this.objUploadDocumentsDTO.ToDate = null;
        this.objUploadDocumentsDTO.DocumentTypeId = DocumentTypeId;
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.apiService.post(this.controllerName, "GetAll", this.objUploadDocumentsDTO).then(data => {
            this.lstUploadedFiles = data;
            this.loading = false;
        });
    }

    public GetByDocumentTypeIdNew(DocumentTypeId) {

        this.loading = true;
        this.objUploadDocumentsDTO.ExpiryDate = null;
        this.objUploadDocumentsDTO.FromDate = null;
        this.objUploadDocumentsDTO.ToDate = null;
        this.objUploadDocumentsDTO.DocumentTypeId = DocumentTypeId;
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.apiService.post(this.controllerName, "GetAll", this.objUploadDocumentsDTO).then(data => {
            this.lstUploadedFiles = data;
            this.loading = false;
        });
    }

    public GetByFormcnfId(FormId) {

        this.loading = true;
        this.objUploadDocumentsDTO.ExpiryDate = null;
        this.objUploadDocumentsDTO.FormCnfgId = FormId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        // this._uploadServices.GetAll(this.objUploadDocumentsDTO).then(data => { this.lstUploadedFiles = data; });
        this.apiService.post(this.controllerName, "GetAll", this.objUploadDocumentsDTO).then(data => {
            this.lstUploadedFiles = data;
            this.loading = false;
        });
    }



    public fnSave(uploadForm) {
        this.submittedUpload = true;
        if (uploadForm.valid) {
            if (this.saveText == "Upload") {
                if (this.uploader.queue.length > 0) {
                    this.objUploadDocumentsDTO.ExpiryDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.ExpiryDate);
                    this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.DocumentDate);
                    this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
                    this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                    this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
                    this.objUploadDocumentsDTO.TblPrimaryKeyId = 0;
                    this.objUploadDocumentsDTO.IsCommon = false;
                    this.objUploadDocumentsDTO.DocumentTypeId = this.DocumentTypeId;
                    let pwd = this.objUploadDocumentsDTO.Password == null ? "" : this.objUploadDocumentsDTO.Password;
                    this.uploader.options.additionalParameter = {
                        "addPar": this.objUploadDocumentsDTO.AgencyProfileId + "^"
                        + this.objUploadDocumentsDTO.TblPrimaryKeyId + "^"
                        + this.objUploadDocumentsDTO.FormCnfgId + "^" + this.objUploadDocumentsDTO.DocumentTypeId + "^"
                        + this.objUploadDocumentsDTO.IsCommon + "^" + this.objUploadDocumentsDTO.UserProfileId + "^"
                        + pwd + "^" + "0" + "^" + this.objUploadDocumentsDTO.Title + "^" + this.objUploadDocumentsDTO.Description + "^"
                        + "0" + "^" + "0" + "^" + false + "^" + "0" + "^" + false + "^" + "0"
                        + "^" + this.objUploadDocumentsDTO.ExpiryDate
                        //+ "^" + this.objUploadDocumentsDTO.UpdatedDate
                        + "^" + this.objUploadDocumentsDTO.DocumentDate
                    };
                    this.uploader.uploadAll();

                    this.uploader.onCompleteAll = () => {
                        this.uploader.clearQueue();
                        this.modal.alertSuccess(Common.GetUploadSuccessfullMsg);
                        this.objUploadDocumentsDTO.ExpiryDate = null;
                        if (this.intformCnfgId == 19)
                            this.apiService.post(this.controllerName, "FosterCarerPoliciesNotifiEmail", this.objUploadDocumentsDTO);
                    };

                }
                else {
                    this.modal.alertDanger(Common.GetSelectDocumentMsg);
                    return;
                }
            }
            else {
                this.objUploadDocumentsDTO.ExpiryDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.ExpiryDate);
                this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.DocumentDate);
                this.objUploadDocumentsDTO.DocumentId = this.documentId;
                this.apiService.post(this.controllerName, "UpdateAdmin", this.objUploadDocumentsDTO).then(data => this.Respone(data));
            }
            this.fnClear();
            this.objUploadDocumentsDTO.ExpiryDate = null;
            this.objUploadDocumentsDTO.DocumentDate = null;
        }

        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.uploader.removeFromQueue(item);
            this.fnBindUploadDocs();
        };
        this.objUploadDocumentsDTO.DocumentDate = null;
        this.objUploadDocumentsDTO.ExpiryDate = null;
    }

    dateString;
    SetExpiryDate() {
        this.objUploadDocumentsDTO.ExpiryDate = this.modal.GetDateEditFormat(this.objUploadDocumentsDTO.ExpiryDate);
        this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateEditFormat(this.objUploadDocumentsDTO.DocumentDate);
    }

    fnEdit(Id) {
        this.IsSaveMode = false;
        this.saveText = "Save";
        this.documentId = Id;
        // this._uploadServices.GetById(Id).then(data => this.objUploadDocumentsDTO = data);
        this.apiService.get(this.controllerName, "GetById", Id).then(data => {
            this.objUploadDocumentsDTO = data;
            this.SetExpiryDate();
        });
    }
    fnDelete(Id) {
        //   if (confirm(Common.GetDeleteConfirmMsg)) {
        //  this._uploadServices.DeleteDocument(Id).then(data => this.Respone(data));
        this.apiService.delete(this.controllerName, Id).then(data => this.Respone(data));
        //  }
    }
    fnDownload(Id, FileName) {
        let agencyId = Common.GetSession("AgencyProfileId");
        window.location.href = environment.api_downloadurl + Id + "," + agencyId;
    }
    fnClear() {
        this.submittedUpload = false;
        this.objUploadDocumentsDTO.Title = "";
        this.objUploadDocumentsDTO.Description = "";
        this.objUploadDocumentsDTO.ExpiryDate = null;
        this.IsSaveMode = true;
        this.saveText = "Upload";
    }
    private Respone(data) {
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage);
        }
        else if (data.IsError == false) {
            this.objUploadDocumentsDTO.ExpiryDate = null;
            this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            this.fnBindUploadDocs();
           // this.objUploadDocumentsDTO = new UploadDocumentsDTO();
        }
    }
}
