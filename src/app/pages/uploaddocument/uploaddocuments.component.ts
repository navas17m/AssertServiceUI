import { AfterViewInit, Component, Input } from '@angular/core';
//import { ConfigTableValuesService} from '../services/configtablevalues.service';
//import { UploadDocumentsService } from '../services/uploaddocuments.service';
//import { ConfigTableNames } from '../configtablenames';
//import { ConfigTableNamesDTO } from '../superadmin/DTO/configtablenames';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
//import {Http, Response,Headers} from '@angular/http';
import { environment } from '../../../environments/environment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { UploadDocumentsDTO } from './DTO/uploaddocumentsdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'Upload-Documents',
    templateUrl: './uploaddocuments.component.template.html',
    // styles: [`[required]  {
    //     border-left: 5px solid blue;
    // }
    // .ng-valid[required], .ng-valid.required  {
    //         border-left: 5px solid #42A948; /* green */
    // }
    // .ng-invalid:not(form)  {
    //     border-left: 5px solid #a94442; /* red */
    // }`],
})

export class UploadDocumentsComponet implements AfterViewInit {
    public searchText: string = "";
    controllerName = "UploadDocuments";
    objQeryVal;
    moduleId; loading = false;
    //submittedUpload = false;
    lstUploadedFiles = [];
    arrUploadedFiles = [];
    saveText = "Upload"; IsSaveMode = true;
    addParameter; documentTypeId; color = ""; UserTypeCnfgId; TypeId;
    // objConfigTableNamesDTO: ConfigTableNamesDTO = new ConfigTableNamesDTO();
    documentTypeList; personUploaded;
    intformCnfgId; btnAccessFormCnfgId; intprimaryKeyId; visibleColor = false; visibleCopyDoc = true; documentId; isEdit = false;
    objUploadDocumentsDTO: UploadDocumentsDTO = new UploadDocumentsDTO();
    objUploadDocumentsNewDTO: UploadDocumentsDTO = new UploadDocumentsDTO();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    footerMessage={
      'emptyMessage' : '',
      'totalMessage' : 'Documents'
    };
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
        this.btnAccessFormCnfgId = formId;
        this.CheckFormAccess(formId);
    }

    @Input()
    set BtnAccessFormCnfgId(formId: any) {
        this.btnAccessFormCnfgId = formId;
        this.CheckFormAccess(formId);
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
    set showColorBox(visible: boolean) {
        this.visibleColor = visible;
    }
    @Input()
    set showCopyDocument(visible: boolean) {
        this.visibleCopyDoc = visible;
    }
    @Input()
    set primaryKeyId(primaryKeyId: any) {
        this.intprimaryKeyId = primaryKeyId;
    }
    @Input()
    set showEdit(edit: boolean) {
        this.isEdit = edit;
    }

    @Input()
    set ModuleId(Id) {
        this.IsModuleIdValid = true;
        this.insModuleId = Id;
        this.fnLoadDropDowns();
        this.fnClear();
        this.objUploadDocumentsDTO.DocumentTypeId = null;
    }

    @Input()
    get IsUpload(): boolean {
        return this.uploader.queue.length > 0 ? true : false;
    }
    //------formbuilder input
    @Input()
    get formbuilder(): any {
        return this._uploadForm;
    }
    @Input() submittedUpload;
    _uploadForm: FormGroup;
    limitPerPage:number=10;
    constructor(private _formBuilder: FormBuilder, private apiService: APICallService,
        private modal: PagesComponent,
        private activatedroute: ActivatedRoute) {
        this.personUploaded = Common.GetSession("UserName");
        this.objUploadDocumentsDTO.DocumentTypeId = null;
        this.objUploadDocumentsDTO.DocumentDate = null;
        this.activatedroute.params.subscribe(data => { this.objQeryVal = data; });

        //   this.objUploadDocumentsDTO.DocumentTypeId = 0;

        this.fnLoadDropDowns();
        this.uploader = new FileUploader({
            url: environment.api_uploadurl,
        });
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.formCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = parseInt(Common.GetSession("ACarerParentId"));
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    ngAfterViewInit() {
        if (this.objQeryVal.mid != null) {
            this.moduleId = this.objQeryVal.mid;
            if (this.moduleId == 13)
                this.moduleId = 3;
            if (this.moduleId == 16)
                this.moduleId = 4;
        }
        if (!this.visibleColor)
            this.fnBindUploadDocsForEdit();
        else
            this.fnBindUploadDocsForCommon();
    }

    fnSetPrimaryKeyId(id) {

        this.intprimaryKeyId = id;
        this.fnBindUploadDocsForEdit();
        this.fnClear();

    }

    fnSetTypeId(TypeId) {
        this.TypeId = TypeId;
    }

    fnSetUserTypeId(id) {
        this.UserTypeCnfgId = id;
    }

    fnClearQueue() {
        this.uploader = new FileUploader({
            url: environment.api_uploadurl,
        });
    }

    IsModuleIdValid = false;
    insModuleId;
    fnSetModuleId(ModuleId) {
        this.IsModuleIdValid = true;
        this.insModuleId = ModuleId;

        this.fnLoadDropDowns();
        this.fnClear();
        this.objUploadDocumentsDTO.DocumentTypeId = null;
    }

    fnLoadDropDowns() {

        //this.objConfigTableNamesDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        //this.objConfigTableNamesDTO.Name = ConfigTableNames.DocumentType;
        //this.objUploadDocumentsDTO.DocumentTypeId = null;
        if (this.objQeryVal.mid != null || this.IsModuleIdValid == true) {
            //  console.log("document");
            //  console.log(this.objQeryVal.mid);
            if (this.IsModuleIdValid == true)
            {
                this.moduleId = this.insModuleId;
            }
            else this.moduleId = this.objQeryVal.mid;

            if (this.moduleId == 13)
                this.moduleId = 3;

            if (this.moduleId == 16)
                this.moduleId = 4;

            //  this._cnfgTblValueServices.GetDocumentTypeByRoleIdModuleId(this.moduleId).then(data => { this.documentTypeList = data; });
            this.apiService.get("ConfigTableValues", "GetDocumentTypeByRoleIdModuleId", this.moduleId).then(data => {
                if (this.intformCnfgId != 41)
                    this.documentTypeList = data;
                else {
                    //let docListTemp = data.filter(t => t.Value.trim() == "Form F");
                    let docListTemp = data.filter(t => t.Value.indexOf("Form F") > -1);
                    this.documentTypeList = docListTemp;
                }
            });
        }
        this._uploadForm = this._formBuilder.group({
            documentType: ["", Validators.required],
            IsCommon: [],
            Password: [],
            DocumentDate: []
        });
    }
    fnBindUploadDocs() {
        this.loading = true;
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        //   this._uploadServices.GetAll(this.objUploadDocumentsDTO).then(data => { this.lstUploadedFiles = data; });
        this.apiService.post(this.controllerName, "GetAll", this.objUploadDocumentsDTO).then(data => {
            this.loading = false;
            this.lstUploadedFiles = data;
        });
    }
    fnBindUploadDocsForCommon() {
        this.loading = true;
        //if (this.intformCnfgId == 41)
        //    this.objUploadDocumentsDTO.IsCommon = false;
        this.objUploadDocumentsDTO.ModuleId = this.moduleId;
        this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.UserTypeCnfgId = this.UserTypeCnfgId;
        this.objUploadDocumentsDTO.Id = this.TypeId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        //  this._uploadServices.GetAllForCommon(this.objUploadDocumentsDTO).then(data => { this.lstUploadedFiles = data; });
        this.apiService.post(this.controllerName, "GetAllForCommon", this.objUploadDocumentsDTO).then(data => {
            this.loading = false;
            this.lstUploadedFiles = data;
        });
    }
    fnBindUploadDocsForEdit() {
        this.objUploadDocumentsDTO.ModuleId = this.moduleId;
        this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objUploadDocumentsDTO.TblPrimaryKeyId = this.intprimaryKeyId;
        // this._uploadServices.GetByPrimaryKey(this.objUploadDocumentsDTO).then(data => { this.lstUploadedFiles = data; });
        this.apiService.post(this.controllerName, "GetByPrimaryKey", this.objUploadDocumentsDTO).then(data => { this.lstUploadedFiles = data; });
    }
    public fnUploadAll(tblPrimaryKey) {
        this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.DocumentDate);
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.objUploadDocumentsDTO.TblPrimaryKeyId = tblPrimaryKey;
        let iscommon = this.objUploadDocumentsDTO.IsCommon == true ? "1" : "0";
        let pwd = this.objUploadDocumentsDTO.Password == null ? "" : this.objUploadDocumentsDTO.Password;
        this.uploader.options.additionalParameter = {
            "addPar": this.objUploadDocumentsDTO.AgencyProfileId + "^"
            + this.objUploadDocumentsDTO.TblPrimaryKeyId + "^"
            + this.objUploadDocumentsDTO.FormCnfgId + "^" + this.objUploadDocumentsDTO.DocumentTypeId + "^"
            + iscommon + "^" + this.objUploadDocumentsDTO.UserProfileId + "^"
            + pwd + "^" + "0" + "^" + "0" + "^" + "0" + "^" + this.UserTypeCnfgId + "^"
            + this.TypeId + "^" + false + "^" + "0" + "^" + false + "^" + "0" + "^" + "0"
            + "^" + this.objUploadDocumentsDTO.DocumentDate
        };
        this.uploader.uploadAll();

        //this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        //    console.log(item);
        //};
        this.uploader.onCompleteAll = () => {
            this.uploader.clearQueue();
            this.fnClear();
            if (!this.visibleColor)
                this.fnBindUploadDocsForEdit();
            else
                this.fnBindUploadDocsForCommon();
        };
    }

    public fnUploadAllForMultiUser(tblPrimaryKey) {
        this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.DocumentDate);
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.objUploadDocumentsDTO.TblPrimaryKeyId = tblPrimaryKey;
        this.objUploadDocumentsDTO.OtherSequenceNumber = tblPrimaryKey;
        this.objUploadDocumentsDTO.IsMultiUserSave = true;

        let iscommon = this.objUploadDocumentsDTO.IsCommon == true ? "1" : "0";
        let pwd = this.objUploadDocumentsDTO.Password == null ? "" : this.objUploadDocumentsDTO.Password;
        this.uploader.options.additionalParameter = {
            "addPar": this.objUploadDocumentsDTO.AgencyProfileId + "^"
            + this.objUploadDocumentsDTO.TblPrimaryKeyId + "^"
            + this.objUploadDocumentsDTO.FormCnfgId + "^" + this.objUploadDocumentsDTO.DocumentTypeId + "^"
            + iscommon + "^" + this.objUploadDocumentsDTO.UserProfileId + "^"
            + pwd + "^" + "0" + "^" + "0" + "^" + "0" + "^"
            + this.UserTypeCnfgId + "^" + this.TypeId + "^" + true + "^"
            + this.objUploadDocumentsDTO.OtherSequenceNumber + "^" + false + "^" + "0" + "^" + "0"
            + "^" + this.objUploadDocumentsDTO.DocumentDate
        };
        this.uploader.uploadAll();

        this.uploader.onCompleteAll = () => {
            this.uploader.clearQueue();
            this.fnClear();
            if (!this.visibleColor)
                this.fnBindUploadDocsForEdit();
            else
                this.fnBindUploadDocsForCommon();
        };

    }


    public fnUploadChildSiblingNParent(listChildSiblingNParent) {
        this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.DocumentDate);
        this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
        this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
        this.objUploadDocumentsDTO.TblPrimaryKeyId = 0;
        this.objUploadDocumentsDTO.OtherSequenceNumber = listChildSiblingNParent;
        this.objUploadDocumentsDTO.IsMultiUserSave = true;

        let iscommon = this.objUploadDocumentsDTO.IsCommon == true ? "1" : "0";
        let pwd = this.objUploadDocumentsDTO.Password == null ? "" : this.objUploadDocumentsDTO.Password;
        this.uploader.options.additionalParameter = {
            "addPar": this.objUploadDocumentsDTO.AgencyProfileId + "^"
            + this.objUploadDocumentsDTO.TblPrimaryKeyId + "^"
            + this.objUploadDocumentsDTO.FormCnfgId + "^" + this.objUploadDocumentsDTO.DocumentTypeId + "^"
            + iscommon + "^" + this.objUploadDocumentsDTO.UserProfileId + "^"
            + pwd + "^" + "0" + "^" + "0" + "^" + "0" + "^"
            + this.UserTypeCnfgId + "^" + this.TypeId + "^" + false + "^" + null + "^" + true
            + "^" + listChildSiblingNParent + "^" + "0"
            + "^" + this.objUploadDocumentsDTO.DocumentDate
        };
        this.uploader.uploadAll();

        this.uploader.onCompleteAll = () => {
            this.uploader.clearQueue();
            this.fnClear();
            if (!this.visibleColor)
                this.fnBindUploadDocsForEdit();
            else
                this.fnBindUploadDocsForCommon();
        };

    }

    fnDelete(Id: number) {
        if (confirm("Are you sure you want to delete this?")) {
          console.log(this.isEdit);
            //  if (confirm(Common.GetDeleteConfirmMsg)) {
            if (!this.isEdit) {
                //this._uploadServices.DeleteDocument(Id).then(data => this.Respone(data));
                this.apiService.delete(this.controllerName, Id).then(data => this.Respone(data,Id));
            } else {
                //this._uploadServices.DeleteCommonUpload(Id).then(data => {
                //    this.Respone(data);
                //});

                this.apiService.get(this.controllerName, "DeleteCommonUpload", Id).then(data => {
                    this.Respone(data,Id);
                });

            }
        }
        // }
    }
    fnDownload(Id, FileName) {
        let agencyId = Common.GetSession("AgencyProfileId");
        window.location.href = environment.api_downloadurl + Id + "," + agencyId;
        this.objUserAuditDetailDTO.ActionId = 11;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.FormCnfgId=this.btnAccessFormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpId = parseInt(Common.GetSession("ACarerParentId"));
        this.objUserAuditDetailDTO.RecordNo = Id;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnEdit(Id) {
        this.IsSaveMode = false;
        this.saveText = "Save";
        this.documentId = Id;
        //   this._uploadServices.GetById(Id).then(data => this.fnEditResponse(data));
        this.apiService.get(this.controllerName, "GetById", Id).then(data => this.fnEditResponse(data));
    }
    fnEditResponse(data) {
        this.objUploadDocumentsDTO = data;
        this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateEditFormat(this.objUploadDocumentsDTO.DocumentDate);
        this.color = this.objUploadDocumentsDTO.ColorCode;
    }
    output;
    public fnSave(uploadForm) {
        this.submittedUpload = true;
        if (uploadForm.valid) {
            this.objUploadDocumentsDTO.DocumentDate = this.modal.GetDateSaveFormat(this.objUploadDocumentsDTO.DocumentDate);
            if (this.saveText == "Upload") {
                if (this.uploader.queue.length > 0) {
                    this.objUploadDocumentsDTO.FormCnfgId = this.intformCnfgId;
                    this.objUploadDocumentsDTO.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
                    this.objUploadDocumentsDTO.UserProfileId = parseInt(Common.GetSession("UserProfileId"));
                    this.objUploadDocumentsDTO.TblPrimaryKeyId = 0;
                    this.objUploadDocumentsDTO.IsCommon = false;
                    let pwd = this.objUploadDocumentsDTO.Password == null ? "" : this.objUploadDocumentsDTO.Password;
                    this.uploader.options.additionalParameter = {
                        "addPar": this.objUploadDocumentsDTO.AgencyProfileId + "^"
                        + this.objUploadDocumentsDTO.TblPrimaryKeyId + "^"
                        + this.objUploadDocumentsDTO.FormCnfgId + "^" + this.objUploadDocumentsDTO.DocumentTypeId + "^"
                        + this.objUploadDocumentsDTO.IsCommon + "^" + this.objUploadDocumentsDTO.UserProfileId + "^"
                        + pwd + "^" + this.color + "^" + "0" + "^" + "0"
                        + "^" + this.UserTypeCnfgId + "^" + this.TypeId + "^" + false +
                        "^" + "0" + "^" + false + "^" + "0" + "^" + "0" + "^" + this.objUploadDocumentsDTO.DocumentDate
                    };
                    this.uploader.uploadAll();
                    this.objUploadDocumentsDTO.DocumentDate = null;
                    this.modal.alertSuccess(Common.GetUploadSuccessfullMsg);
                    this.objUserAuditDetailDTO.ActionId = 16;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    //this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                    this.objUserAuditDetailDTO.FormCnfgId=this.btnAccessFormCnfgId;
                    //this.objUserAuditDetailDTO.ChildCarerEmpId = parseInt(Common.GetSession("ACarerParentId"));
                    //this.objUserAuditDetailDTO.RecordNo = Id;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }
                else
                    this.modal.alertDanger(Common.GetSelectDocumentMsg);
            }
            else {
                this.objUploadDocumentsDTO.DocumentId = this.documentId;
                this.objUploadDocumentsDTO.ColorCode = this.color;
                //this._uploadServices.UpdateDocument(this.objUploadDocumentsDTO).then(data => {
                //    this.output = data;
                //    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
                //});

                this.apiService.post(this.controllerName, "Update", this.objUploadDocumentsDTO).then(data => {
                    this.output = data;
                    this.objUploadDocumentsDTO.DocumentDate = null;
                    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
                    this.ngAfterViewInit();
                });
            }
            this.fnClear();
            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                this.uploader.removeFromQueue(item);
                this.fnBindUploadDocsForCommon();
            };

            this.objUploadDocumentsDTO.DocumentDate = null;
        }
    }
    fnClear() {

        this.submittedUpload = false;
        this.objUploadDocumentsDTO.DocumentTypeId = null;
        this.objUploadDocumentsDTO.Password = "";
        this.objUploadDocumentsDTO.DocumentDate = null;
        this.color = "";
        this.IsSaveMode = true;
        this.saveText = "Upload";
    }
    private Respone(data,Id) {
        console.log(data);
        if (data.IsError == true) {
            alert(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.objUploadDocumentsDTO.DocumentDate = null;
            this.modal.alertSuccess(Common.GetDeleteSuccessfullMsg);
            if (!this.visibleColor)
                this.fnBindUploadDocsForEdit();
            else
                this.fnBindUploadDocsForCommon();
            this.objUserAuditDetailDTO.ActionId = 15;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.FormCnfgId=this.btnAccessFormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpId = parseInt(Common.GetSession("ACarerParentId"));
            this.objUserAuditDetailDTO.RecordNo = Id;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }


    insFormRoleAccessMapping = [];
    UserProfileId;
    insVisible = false;
    CheckFormAccess(FormId) {

        this.insFormRoleAccessMapping = JSON.parse(Common.GetSession("FormRoleAccessMapping"));

        this.UserProfileId = Common.GetSession("UserProfileId");
        if (this.UserProfileId == 1) {
            this.insVisible = true;
        }
        else if (FormId != null && this.insFormRoleAccessMapping != null) {
            let check = this.insFormRoleAccessMapping.filter(data => data.FormCnfgId == FormId && data.AccessCnfgId == 4);
            if (check.length > 0) {
                this.insVisible = true;
            }
            else {
                this.insVisible = false;
            }
        }
    }
    setPageSize(pageSize:string){
      this.limitPerPage = parseInt(pageSize);
    }
}
