import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleTimer } from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { Common, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat, deepCopy, DynamicValueDTO } from '../common';
import { ValChangeDTO } from '../dynamic/valchangeDTO';
import { PagesComponent } from '../pages.component';
import { SaveDraftInfoDTO } from '../savedraft/DTO/savedraftinfodto';
import { APICallService } from '../services/apicallservice.service';

import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { CarerDisclosureDTO } from './DTO/carerdisclosuredto';

declare var window: any;
declare var $: any;

@Component({
    selector: 'CarerDisclosureDate',
    templateUrl: './carerdisclosuredata.component.template.html',

})
export class CarerdisclosureDataComponent {
    public searchText: string = "";
    @ViewChild('btnLockModel') lockModal: ElementRef;
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";
    controllerName = "carerdisclosure";

    objCarerDisclosureDTO: CarerDisclosureDTO = new CarerDisclosureDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    submitted = false;
    dynamicformcontrol = [];
    dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    isVisibleMandatoryMsg;
    SequenceNo;
    objQeryVal;
    CarerParentId: number;
    AgencyProfileId: number;
    //upload doc
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerSectionAActive = "active";
    CarerSectionAVisible = true;

    DocumentActive;
    isLoading: boolean = false;

    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmitAdd;

    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false; isUploadDoc: boolean = false;
    insCarerDetails;SocialWorkerId;
    CarerCode;
    constructor(private _formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private _router: Router, private module: PagesComponent,
        private st: SimpleTimer, private renderer: Renderer2, private apiService: APICallService) {

        this.route.params.subscribe(data => this.objQeryVal = data);
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        this.SocialWorkerId = Common.GetSession("ACarerSSWId");
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.objCarerDisclosureDTO.AgencyProfileId = this.AgencyProfileId;
        this.objCarerDisclosureDTO.CarerParentId = this.CarerParentId;
        this.objCarerDisclosureDTO.ControlLoadFormat = ["Default"];
        this.SequenceNo = this.objQeryVal.Id;

        if (Common.GetSession("SelectedCarerProfile") != null) {
            this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
            this.CarerCode = this.insCarerDetails.CarerCode;
        }
        //Upload Doc
        this.formId = 330;
        Common.SetSession("formcnfgid", this.formId);
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.SequenceNo;

        if (this.SequenceNo != 0 && this.SequenceNo != null)
            this.objCarerDisclosureDTO.SequenceNo = this.SequenceNo;
        else {
            this.objCarerDisclosureDTO.SequenceNo = 0;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerDisclosureDTO).then(data => {
                this.dynamicformcontrol = data;
            });
        }

        this._Form = _formBuilder.group({});
        if (Common.GetSession("SaveAsDraft") == "N") {
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objCarerDisclosureDTO.SequenceNo = this.SequenceNo;
            this.objCarerDisclosureDTO.AgencyProfileId = this.AgencyProfileId;
            this.objCarerDisclosureDTO.CarerParentId = this.CarerParentId;
            this.apiService.post(this.controllerName, "GetDynamicControls", this.objCarerDisclosureDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {
                this.dynamicformcontrol = JSON.parse(data.JsonData);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
                let tempDoc = JSON.parse(data.JsonList);
                if (tempDoc != null)
                    this.isUploadDoc = tempDoc[0].IsDocumentExist;
            });
        }
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
    }


    fnCarerSectionA() {
        this.CarerSectionAActive = "active";

        this.DocumentActive = "";
    }

    fnDocumentDetail() {
        this.CarerSectionAActive = "";
        this.DocumentActive = "active";
    }


    isDirty = true;
    DocOk = true; IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, SectionAdynamicValue, SectionAdynamicForm,
         UploadDocIds, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;
        this.DocOk = true;

        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }

        if (!mainFormBuilder.valid) {
            this.CarerSectionAActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        } else if (!SectionAdynamicForm.valid) {
            this.CarerSectionAActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(SectionAdynamicForm);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.CarerSectionAActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (mainFormBuilder.valid && SectionAdynamicForm.valid
             && this.DocOk) {

            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(SectionAdynamicValue, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N")
                    type = "update";
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y") ){
                let val2 = SectionAdynamicValue.filter(x => x.FieldName == "SocialWorkerId");
                if (val2.length > 0 && (val2[0].FieldValue == null || val2[0].FieldValue == ''))
                {
                    val2[0].FieldValue = this.SocialWorkerId;
                }
            }
                this.objCarerDisclosureDTO.DynamicValue = SectionAdynamicValue;
                this.objCarerDisclosureDTO.CarerParentId = this.CarerParentId;
                this.objCarerDisclosureDTO.NotificationEmailIds = EmailIds;
                this.objCarerDisclosureDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
               // console.log(this.objCarerDisclosureDTO);
                this.apiService.save(this.controllerName, this.objCarerDisclosureDTO, type).then(data => this.Respone(data, type, IsUpload, this.skipAlert));
            }
            else {
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }
    }

    private Respone(data, type, IsUpload, skipAlert: boolean) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);
            if (type == "save") {
                if (skipAlert)
                    this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
            }
            else {
                if (skipAlert)
                    this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
            }

            if (this.SequenceNo == 0 || this.showbtnSaveDraft) {
                if (skipAlert)
                    this._router.navigate(['/pages/fostercarer/disclosurelist', data.SequenceNumber]);
            }
            else {
                if (skipAlert)
                    this._router.navigate(['/pages/fostercarer/disclosurelist/3']);
            }
            this.skipAlert = true;
            this.objCarerDisclosureDTO.IsSubmitted = true;
        }
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
                if (!this.showAlert)
                    this.module.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.SequenceNo);
                }
                if (!this.showAlert)
                    this.module.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
            this.showAlert = false;
        }
    }

    DynamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "SaveAsDraftStatus") {
            InsValChange.currnet.IsVisible = false;
        }

    }
    fnSaveDraft(SectionAdynamicValue, IsUpload, uploadFormBuilder) {
        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 4;
        this.objSaveDraftInfoDTO.TypeId = this.CarerParentId;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid)
                this.fnSubSaveDraft(SectionAdynamicValue, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(SectionAdynamicValue, IsUpload, uploadFormBuilder);
        Common.SetSession("SaveAsDraft", "Y");
        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "SaveAsDraftStatus") {
                item.IsVisible = false;
            }
        });
    }
    fnSubSaveDraft(dynamicForm, IsUpload, uploadFormBuilder) {
        let type = "save";
        if (this.SequenceNo > 0) {
            type = "update";
            this.isDirty = true;
            if (this.SequenceNo != 0 && CompareSaveasDraft(this.dynamicformcontrol, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);
                this.objCarerDisclosureDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            }
            else {
                this.showAutoSave = false;
                if (this.showAlert == false && this.IsNewOrSubmited == 1)
                    this.module.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                    this.module.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = false;
            }
        }
        else {
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.tblPrimaryKey = this.SequenceNo;
                this.objCarerDisclosureDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));

            });
        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
            item.CarerParentId = this.CarerParentId;
            if (item.FieldName == "SaveAsDraftStatus")
                item.FieldValue = "1";
            if (IsUpload)
                item.IsDocumentExist = true;
            else
                item.IsDocumentExist = this.isUploadDoc;
        });
    }

    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('CarerDisclosure180', environment.autoSaveTime);
        this.subscribeTimer2();
    }
    subscribeTimer2() {
        if (this.timer2Id) {
            // Unsubscribe if timer Id is defined
            this.st.unsubscribe(this.timer2Id);
            this.timer2Id = undefined;
            this.timer2button = 'Subscribe';
        } else {
            // Subscribe if timer Id is undefined
            this.timer2Id = this.st.subscribe('CarerDisclosure180', () => this.timer2callback());
            this.timer2button = 'Unsubscribe';

        }
    }
    timer2callback() {
        //this.counter2++;
        if (this.isReadOnly == "0" || this.isReadOnly == null) {
            if (this.isFirstTime) {
                this.showAutoSave = true;
                let event = new MouseEvent('click', { bubbles: true });
                if (this.SequenceNo > 0 && Common.GetSession("SaveAsDraft") == "N") {
                    this.saveDraftText = "Record auto-saved @";
                    this.skipAlert = false;
                    this.objCarerDisclosureDTO.IsSubmitted = false;
                    this.btnSubmitAdd.fnClick();
                }
                else {
                    this.showAlert = true;
                    this.saveDraftText = "Draft auto-saved @";
                    this.btnSaveDraft.nativeElement.dispatchEvent(event);
                }
                this.draftSavedTime = Date.now();
            }
            this.isFirstTime = true;
        }
    }
    ngOnDestroy() {
        this.st.delTimer('CarerDisclosure180');
        Common.SetSession("formcnfgid", "0");
    }

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerDisclosurePDF/" + this.CarerCode+ "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerDisclosureWord/" + this.CarerCode+ "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerDisclosurePrint", this.CarerCode + "," + this.CarerParentId+ "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
            var popupWin;
            // var style = ""; var link = "";
            // var i;
            // for (i = 0; i < $("style").length; i++) {
            //     style = style + $("style")[i].outerHTML;
            // }
            // var j;
            // for (j = 0; j < $("link").length; j++) {
            //     link = link + $("link")[j].outerHTML;
            // }
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
            popupWin.document.open();
            popupWin.document.write(`
      <html>
        <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Print tab</title>

        <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
    <body onload="window.print();window.close()">${data}</body>
      </html>`);
            popupWin.document.close();
        });
    }
    fnShowEmail() {
        this.subject = "";
        this.eAddress = "";
        this.submittedprint = false;
        let event = new MouseEvent('click', { bubbles: true });
        this.infoPrint.nativeElement.dispatchEvent(event);
    }
    fnEmail(form) {
        this.submittedprint = true;
        if (form.valid) {
            this.isLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.CarerCode+ "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId ;
            this.apiService.post("GeneratePDF", "EmailCarerDisclosure", this.objNotificationDTO).then(data => {
                if (data == true)
                    this.module.alertSuccess("Email Send Successfully..");
                else
                    this.module.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.isLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}
