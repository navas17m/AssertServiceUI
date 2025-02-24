import { Component, Pipe, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Common, deepCopy, Compare, CompareSaveasDraft, ConvertDateAndDateTimeSaveFormat}  from  '../common'
import { ChildMatchingChecklistDTO } from './DTO/childmatchingchecklistdto'
import { ValChangeDTO } from '../dynamic/ValChangeDTO'
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { SaveDraftInfoDTO} from '../savedraft/DTO/savedraftinfodto';
import {SimpleTimer} from 'ng2-simple-timer';
import { environment } from '../../../environments/environment';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { ChildProfile } from '../child/DTO/childprofile'
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
declare var window: any;
declare var $: any;
//.@Pipe({ name: 'groupBy' })
@Component({
    selector: 'ChildMatchingChecklistData',
    templateUrl: './childmatchingchecklistdata.component.template.html',
})

export class ChildMatchingChecklistDataComponent {
    @ViewChild('btnPrint',{static:false}) infoPrint: ElementRef;
    @ViewChild('btnCancel',{static:false}) infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    apiURL = environment.api_url + "/api/GeneratePDF/";

    objChildMatchingChecklistDTO: ChildMatchingChecklistDTO = new ChildMatchingChecklistDTO();
    objSaveDraftInfoDTO: SaveDraftInfoDTO = new SaveDraftInfoDTO();
    insChildProfileDTO: ChildProfile = new ChildProfile();
    submitted = false;
    dynamicformcontrol = []; dynamicformcontrolOrginal = [];
    _Form: FormGroup;
    SequenceNo;
    objQeryVal;
    formId;
    ChildID: number;
    isLoading: boolean = false; controllerName = "ChildMatchingChecklist";
    //Doc
    FormCnfgId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    PageAActive = "active";
    DocumentActive; isUploadDoc: boolean = false;
    childName;
    draftSavedTime;
    timer2Id: string;
    timer2button = 'Subscribe';
    @ViewChild('btnSaveDraft') btnSaveDraft: ElementRef;
    @ViewChild('btnSubmit') btnSubmit;
    skipAlert: boolean = true;
    saveDraftText = "Draft auto-saved @"; showAutoSave: boolean = false;
    showbtnSaveDraft: boolean = true;
    showAlert: boolean = false;
    AgencyProfileId:number;
    CarerParentId:number;
    SocialWorkerId;
    LASocialWorkerId;
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    
    constructor(private apiService: APICallService, private _formBuilder: FormBuilder,
        private route: ActivatedRoute, private _router: Router, private modal: PagesComponent,
        private st: SimpleTimer,
        private renderer: Renderer2) {
            this.formId = 227;

         this.route.params.subscribe(data => this.objQeryVal = data);
            //  if (Common.GetSession("ReferralChildId") != null)
        if (this.objQeryVal.mid == 4)
         this.ChildID = parseInt(Common.GetSession("ChildId"));
        else
          this.ChildID = parseInt(Common.GetSession("ReferralChildId"));

       this.insChildProfileDTO = JSON.parse(Common.GetSession("SelectedChildProfile"));
       this.childName = this.insChildProfileDTO.PersonalInfo.FirstName + " " + this.insChildProfileDTO.PersonalInfo.lastName +
           " (" + this.insChildProfileDTO.ChildCode + ")";


        this.fnCheckChildSelection();
        this.objChildMatchingChecklistDTO.ChildId = this.ChildID;
        this.SequenceNo = this.objQeryVal.Id;
        if (this.SequenceNo != 0 && this.SequenceNo != null) {
            this.objChildMatchingChecklistDTO.SequenceNo = this.SequenceNo;
        } else {
            this.objChildMatchingChecklistDTO.SequenceNo = 0;
        }
        this.SocialWorkerId = Common.GetSession("SSWId");
        this.LASocialWorkerId = Common.GetSession("ChildLASocialWorkerId");
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.CarerParentId = parseInt(Common.GetSession("CarerId"));

       // apiService.post(this.controllerName, "GetDynamicControls", this.objChildMatchingChecklistDTO).then(data => { this.dynamicformcontrol = data; });
     //.  console.log(this.SequenceNo);
        if (Common.GetSession("SaveAsDraft") == "N" ||this.SequenceNo==0) {

           // console.log(222);
            if (this.SequenceNo != 0)
                this.showbtnSaveDraft = false;
            this.objChildMatchingChecklistDTO.SequenceNo = this.objQeryVal.Id;
            this.objChildMatchingChecklistDTO.AgencyProfileId = this.AgencyProfileId
            apiService.post(this.controllerName, "GetDynamicControls", this.objChildMatchingChecklistDTO).then(data => {
                this.dynamicformcontrol = data;
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            });
        }
        else {
            this.objSaveDraftInfoDTO.SequenceNo = this.objQeryVal.Id;
            this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
            this.objSaveDraftInfoDTO.TypeId = this.ChildID;
            this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;

            this.apiService.post("SaveAsDraftInfo", "GetById", this.objSaveDraftInfoDTO).then(data => {

                this.dynamicformcontrol = JSON.parse(data.JsonData);
              //  console.log(this.dynamicformcontrol);
                this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            });
        }
        this._Form = _formBuilder.group({});
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
        //Doc

        this.TypeId = this.ChildID;
        this.tblPrimaryKey = this.SequenceNo;

        if(Common.GetSession("ViweDisable")=='1'){
            this.objUserAuditDetailDTO.ActionId = 4;
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
            this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
            }
    }

    bindData()
    {

    }

    fnCheckChildSelection() {
        if (this.objQeryVal.mid == 16) {
            if (Common.GetSession("ReferralChildId") != null && Common.GetSession("ReferralChildId") != "null") {
                this.ChildID = parseInt(Common.GetSession("ReferralChildId"));
                this.objChildMatchingChecklistDTO.ChildId=this.ChildID;
            }
            else {
                Common.SetSession("UrlReferral", "pages/referral/childmatchingchecklist/16");
                this._router.navigate(['/pages/referral/childprofilelist/0/16']);
            }
        }
        else {
            if (Common.GetSession("ChildId") != null && Common.GetSession("ChildId") != "null") {
                this.ChildID = parseInt(Common.GetSession("ChildId"));
                this.objChildMatchingChecklistDTO.ChildId=this.ChildID;
            }
            else {

                Common.SetSession("UrlReferral", "pages/child/childmatchingchecklist/16");
                this._router.navigate(['/pages/child/childprofilelist/1/4']);
            }
        }
    }
    DocOk = true;
    isDirty = true;
    IsNewOrSubmited = 1;//New=1 and Submited=2
    clicksubmit(mainFormBuilder, dynamicForm, subformbuilder, IsUpload, uploadFormBuilder, AddtionalEmailIds, EmailIds) {
        this.submitted = true;

        if (!subformbuilder.valid) {
            this.PageAActive = "active";
            this.DocumentActive = "";
            this.modal.GetErrorFocus(subformbuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.PageAActive = "";
            this.DocumentActive = "active";
            this.modal.GetErrorFocus(uploadFormBuilder);
        }
        else {
            this.PageAActive = "active";
            this.DocumentActive = "";
        }

        this.DocOk = true;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid) {
                this.DocOk = true;
            }
            else
                this.DocOk = false;
        }
        if (mainFormBuilder.valid && subformbuilder.valid && dynamicForm != '' && this.DocOk) {

            this.isDirty = true;
            if (this.SequenceNo != 0 && Compare(dynamicForm, this.dynamicformcontrolOrginal)) {
                this.isDirty = false;
            }
            if (this.isDirty || (IsUpload && uploadFormBuilder.valid)) {
                this.isLoading = true;
                let type = "save";
                if (dynamicForm[0].UniqueId != 0)
                    type = "update";
                if((this.SequenceNo == 0) || (this.SequenceNo != 0 && Common.GetSession("SaveAsDraft") == "Y")){
                let val = dynamicForm.filter(x => x.FieldName == "SocialWorkerId");
                if (val.length > 0 && (val[0].FieldValue == null || val[0].FieldValue == ''))
                  val[0].FieldValue = this.SocialWorkerId;

                let valLASW = dynamicForm.filter(x => x.FieldName == "LASocialWorkerId");
                if (valLASW.length > 0 && (valLASW[0].FieldValue == null || valLASW[0].FieldValue == ''))
                  valLASW[0].FieldValue = this.LASocialWorkerId;
                }
                this.objChildMatchingChecklistDTO.NotificationEmailIds = EmailIds;
                this.objChildMatchingChecklistDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
                this.objChildMatchingChecklistDTO.DynamicValue = dynamicForm;
                this.objChildMatchingChecklistDTO.ChildId = this.ChildID;
                this.apiService.save(this.controllerName, this.objChildMatchingChecklistDTO, type).then(data => this.Respone(data, type, IsUpload,this.skipAlert));
            }
            else {
                this.showAutoSave = false;
                if (this.skipAlert && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.skipAlert && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.skipAlert = true;
            }
        }/////////
    }
    fnPageA() {
        this.PageAActive = "active";
        this.DocumentActive = "";
    }
    fnDocumentDetail() {
        this.PageAActive = "";
        this.DocumentActive = "active";
    }
    private Respone(data, type, IsUpload, skipAlert: boolean) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            this.dynamicformcontrolOrginal = ConvertDateAndDateTimeSaveFormat(this.dynamicformcontrolOrginal);
            if (type == "save") {
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetSaveSuccessfullMsg);
            }
            else {
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (skipAlert)
                    this.modal.alertSuccess(Common.GetUpdateSuccessfullMsg);
            }
            if (skipAlert)
            {
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                if (this.objQeryVal.mid == 16) {
                    this._router.navigate(['/pages/referral/childmatchingchecklist/16']);
                }
                else
                {
                    this._router.navigate(['/pages/child/childmatchingchecklist/4']);
                }
            }
            this.skipAlert = true;
            this.objChildMatchingChecklistDTO.IsSubmitted = true;
        }
    }

    DnamicOnValChange(InsValChange: ValChangeDTO) {
        if (InsValChange.currnet.FieldCnfg.FieldName == "EthnicityCultureId") {
            let EthnicityCulture = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "EthnicityCulture");
            if (InsValChange.currnet.GridDisplayField == "Match" || InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                EthnicityCulture[0].IsVisible = true;
            else
                EthnicityCulture[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "LanguageId") {
            let Language = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Language");
            if (InsValChange.currnet.GridDisplayField == "Match" || InsValChange.currnet.GridDisplayField == "Part Match"  || InsValChange.currnet.GridDisplayField == "No Match")
                Language[0].IsVisible = true;
            else
                Language[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "ReligionId") {
            let Religion = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Religion");
            if (InsValChange.currnet.GridDisplayField == "Match" || InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                Religion[0].IsVisible = true;
            else
                Religion[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "LocalityId") {
            let Locality = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Locality");
            if (InsValChange.currnet.GridDisplayField == "Match" || InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                Locality[0].IsVisible = true;
            else
                Locality[0].IsVisible = false;
        }

        if (InsValChange.currnet.FieldCnfg.FieldName == "EducationId") {
            let Education = InsValChange.all.filter(item => item.FieldCnfg.FieldName == "Education");
            if (InsValChange.currnet.GridDisplayField == "Match" || InsValChange.currnet.GridDisplayField == "Part Match" || InsValChange.currnet.GridDisplayField == "No Match")
                Education[0].IsVisible = true;
            else
                Education[0].IsVisible = false;
        }
        if (InsValChange.currnet.FieldCnfg.FieldName == "SocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
        else if (InsValChange.currnet.FieldCnfg.FieldName == "LASocialWorkerId") {
          InsValChange.currnet.IsVisible = false;
        }
    }

    //Save as draft
    fnSaveDraft(SectionChildDetailsDynamic,
        IsUpload,
        uploadFormBuilder) {

        this.submitted = false;
        let userId: number = parseInt(Common.GetSession("UserProfileId"));
        this.objSaveDraftInfoDTO.AgencyProfileId = this.AgencyProfileId;
        this.objSaveDraftInfoDTO.FormCnfgId = this.formId;
        this.objSaveDraftInfoDTO.UserTypeCnfgId = 5;
        this.objSaveDraftInfoDTO.TypeId = this.ChildID;
        this.objSaveDraftInfoDTO.CreatedUserId = userId;
        this.objSaveDraftInfoDTO.UpdatedUserId = userId;
        this.objSaveDraftInfoDTO.CarerParentId = this.CarerParentId;
        if (IsUpload) {
            this.submittedUpload = true;
            if (uploadFormBuilder.valid)
                this.fnSubSaveDraft(SectionChildDetailsDynamic, IsUpload, uploadFormBuilder);
        }
        else
            this.fnSubSaveDraft(SectionChildDetailsDynamic, IsUpload, uploadFormBuilder);
        Common.SetSession("SaveAsDraft", "Y");
        this.dynamicformcontrol.forEach(item => {
            if (item.FieldCnfg.FieldName == "AddtoSiblingsRecord" || item.FieldCnfg.FieldName == "AddtoParent/ChildRecord"
                || item.FieldCnfg.FieldName == "SelectSiblings") {
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
                this.objChildMatchingChecklistDTO.SequenceNo = this.SequenceNo;
                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));
            }
            else {
                this.showAutoSave = false;
                if (this.showAlert == false && this.IsNewOrSubmited == 1)
                    this.modal.alertWarning(Common.GetNoChangeAlert);
                else if (this.showAlert == false && this.IsNewOrSubmited == 2)
                    this.modal.alertSuccess(Common.GetRecordAlreadySavedfullMsg);
                this.showAlert = false;
            }
        }
        else {
            this.apiService.get(this.controllerName, "GetNextSequenceNo", this.formId).then(data => {
                this.SequenceNo = parseInt(data);
                this.objChildMatchingChecklistDTO.SequenceNo = this.SequenceNo;
                this.fnUpdateDynamicForm(dynamicForm, IsUpload);

                this.objSaveDraftInfoDTO.JsonList = JSON.stringify(dynamicForm);
                this.objSaveDraftInfoDTO.JsonData = JSON.stringify(this.dynamicformcontrol);
                this.objSaveDraftInfoDTO.SequenceNo = this.SequenceNo;
                //console.log(this.objSaveDraftInfoDTO);
                this.apiService.post("SaveAsDraftInfo", "Save", this.objSaveDraftInfoDTO).then(data => this.ResponeDraft(data, type, IsUpload));

            });
        }

    }
    private fnUpdateDynamicForm(dynamicForm, IsUpload) {
        dynamicForm.forEach(item => {
            item.AgencyProfileId = this.AgencyProfileId;
            item.SequenceNo = this.SequenceNo;
           // item.ChildName = this.insChildProfileDTO.PersonalInfo.FirstName + " " + this.insChildProfileDTO.PersonalInfo.lastName;
           // item.CarerName = this.carerName;
            item.CarerParentId = this.CarerParentId;
            if (item.FieldName == "SaveAsDraftStatus")
                item.FieldValue = "1";
            if (IsUpload)
                item.IsDocumentExist = true;
            else
                item.IsDocumentExist = this.isUploadDoc;
        });
    }
    private ResponeDraft(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.modal.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            this.IsNewOrSubmited = 2;
            this.dynamicformcontrolOrginal = deepCopy<any>(this.dynamicformcontrol);
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(data.SequenceNumber);
                }
                if (!this.showAlert)
                    this.modal.alertSuccess(Common.GetSaveDraftSuccessfullMsg);
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                if (!this.showAlert)
                    this.modal.alertSuccess(Common.GetUpdateDraftSuccessfullMsg);
            }
            this.showAlert = false;
        }
    }
    isFirstTime: boolean = false;
    isReadOnly;
    ngOnInit() {
        this.isReadOnly = Common.GetSession("ViweDisable");
        this.st.newTimer('matching180', environment.autoSaveTime);
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
            this.timer2Id = this.st.subscribe('matching180', () => this.timer2callback());
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
                    this.objChildMatchingChecklistDTO.IsSubmitted = false;
                    this.btnSubmit.fnClick();
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

    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateChildMatchingChecklistPDF/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateChildMatchingChecklistWord/" + this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateChildMatchingChecklistPrint", this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
        this.objUserAuditDetailDTO.ActionId =8;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
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
            this.objNotificationDTO.Body = this.ChildID + "," + this.SequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailChildMatchingChecklist", this.objNotificationDTO).then(data => {
                if (data == true)
                {
                    this.modal.alertSuccess("Email Send Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 1;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.ChildID;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);                    
                }                    
                else
                    this.modal.alertDanger("Email not Send Successfully..");
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
