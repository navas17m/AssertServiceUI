import { Component, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { ApprovedPanelMinutesDTO } from './DTO/approvedpanelminutesdto';
declare var $: any;
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'ApprovedPanelMinutesData',
    templateUrl: './approvedpanelminutesdata.component.template.html',
})

export class ApprovedPanelMinutesDataComponent {
    controllerName = "ApprovedPanelMinutes";
    objApprovedPanelMinutesDTO: ApprovedPanelMinutesDTO = new ApprovedPanelMinutesDTO();
    submitted = false;
    _Form: FormGroup;
    objQeryVal;
    //Doc
    FormCnfgId;
    formId;
    tblPrimaryKey;
    TypeId;
    submittedUpload = false;
    @ViewChild('uploads') uploadCtrl;
    CarerParentId: number;
    AgencyProfileId: number;
    insCarerDetails;
    SectionAActive = "active";
    DocumentActive;
    isLoading: boolean = false;
    UserName;
    //Print
    CarerCode;
    SequenceNo: number;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    constructor(private _formBuilder: FormBuilder,
        private activatedroute: ActivatedRoute,
        private _router: Router, private module: PagesComponent,
        private apiService: APICallService, private renderer: Renderer2) {
        this.objApprovedPanelMinutesDTO.DateOfPanel = null;
        this.objApprovedPanelMinutesDTO.ApprovalDate = null;
        this.activatedroute.params.subscribe(data => {
            this.objQeryVal = data;
        });
        this.UserName = Common.GetSession("UserName");
        if (this.objQeryVal.mid == 3) {
            this.FormCnfgId = 204;
            this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
            if (Common.GetSession("SelectedCarerProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedCarerProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }
        else if (this.objQeryVal.mid == 13) {
            this.FormCnfgId = 205;
            this.CarerParentId = parseInt(Common.GetSession("CarerParentId"));
            if (Common.GetSession("SelectedApplicantProfile") != null) {
                this.insCarerDetails = JSON.parse(Common.GetSession("SelectedApplicantProfile"));
                this.CarerCode = this.insCarerDetails.CarerCode;
            }
        }

        this._Form = _formBuilder.group({
            DateOfPanel: ['', Validators.required],
            ApprovalDate: [],
            AgendaItems: [],
            PanelMinutes: [],
            FinalDecision: [],
            MakerMinutes: [],
            PanelApproval: [],
        });
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
        //Doc
        this.formId = 204;
        this.TypeId = this.CarerParentId;
        this.tblPrimaryKey = this.objQeryVal.id;
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this.SequenceNo = this.objQeryVal.id;
        if (this.objQeryVal.id != "0") {
            this.apiService.get(this.controllerName, "GetById", this.objQeryVal.id).then(data => {
                this.objApprovedPanelMinutesDTO = data;
                this.UserName = data.UpdatedUserName;
                this.SetDate();
            });
        }
        if(Common.GetSession("ViweDisable")=='1'){
          this.objUserAuditDetailDTO.ActionId = 4;
          this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
          this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
          this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
          this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
          this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
          this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
          Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
          }
    }
    dateString;
    SetDate() {
        this.objApprovedPanelMinutesDTO.DateOfPanel = this.module.GetDateEditFormat(this.objApprovedPanelMinutesDTO.DateOfPanel);
        this.objApprovedPanelMinutesDTO.ApprovalDate = this.module.GetDateEditFormat(this.objApprovedPanelMinutesDTO.ApprovalDate);
    }

    fnSectionA() {
        this.SectionAActive = "active";
        this.DocumentActive = "";
    }

    fnDocumentDetail() {
        this.SectionAActive = "";
        this.DocumentActive = "active";
    }

    DocOk = true;
    clicksubmit(mainFormBuilder, UploadDocIds, IsUpload, uploadFormBuilder,
        AddtionalEmailIds, EmailIds) {
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
            this.SectionAActive = "active";
            this.DocumentActive = "";
            this.module.GetErrorFocus(mainFormBuilder);
        } else if (IsUpload && !uploadFormBuilder.valid) {
            this.SectionAActive = "";
            this.DocumentActive = "active";
            this.module.GetErrorFocus(uploadFormBuilder);
        }

        if (this.DocOk && mainFormBuilder.valid) {
            this.isLoading = true;
            let type = "save";
            if (this.objQeryVal.id != "0")
                type = "update";
            this.objApprovedPanelMinutesDTO.DateOfPanel = this.module.GetDateSaveFormat(this.objApprovedPanelMinutesDTO.DateOfPanel);
            this.objApprovedPanelMinutesDTO.ApprovalDate = this.module.GetDateSaveFormat(this.objApprovedPanelMinutesDTO.ApprovalDate);
            this.objApprovedPanelMinutesDTO.NotificationEmailIds = EmailIds;
            this.objApprovedPanelMinutesDTO.NotificationAddtionalEmailIds = AddtionalEmailIds;
            this.objApprovedPanelMinutesDTO.CarerParentId = this.CarerParentId;
            this.apiService.save(this.controllerName, this.objApprovedPanelMinutesDTO, type).then(data => this.Respone(data, type, IsUpload));
        }
    }

    private Respone(data, type, IsUpload) {
        this.isLoading = false;
        if (data.IsError == true) {
            this.module.alertDanger(data.ErrorMessage)
        }
        else if (data.IsError == false) {
            if (type == "save") {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAllForMultiUser(data.SequenceNumber);
                }
                this.module.alertSuccess(Common.GetSaveSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =1;
                this.objUserAuditDetailDTO.RecordNo = data.SequenceNumber;
            }
            else {
                if (IsUpload) {
                    this.uploadCtrl.fnUploadAll(this.tblPrimaryKey);
                }
                this.module.alertSuccess(Common.GetUpdateSuccessfullMsg);
                this.objUserAuditDetailDTO.ActionId =2;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
            }

            if (this.objQeryVal.mid == 13)
                this._router.navigate(['/pages/recruitment/apmlist/13']);
            else
                this._router.navigate(['/pages/fostercarer/fcapmlist/3']);
            this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
            this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
            this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
            this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
            Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
        }
    }

    //PDF
    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerApprovedPanelMinutesPDF/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =7;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {
        window.location.href = this.apiURL + "GenerateCarerApprovedPanelMinutesWord/" + this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
        this.objUserAuditDetailDTO.ActionId =6;
        this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        this.apiService.get("GeneratePDF", "GenerateCarerApprovedPanelMinutesPrint", this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId).then(data => {
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
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
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
            this.objNotificationDTO.Body = this.CarerCode + "," + this.CarerParentId + "," + this.SequenceNo + "," + this.AgencyProfileId;
            this.apiService.post("GeneratePDF", "EmailCarerApprovedPanelMinutes", this.objNotificationDTO).then(data => {
                if (data == true){
                    this.module.alertSuccess("Email Sent Successfully..");
                this.objUserAuditDetailDTO.ActionId =9;
                this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }
                else
                    this.module.alertDanger("Email not Sent Successfully..");
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
