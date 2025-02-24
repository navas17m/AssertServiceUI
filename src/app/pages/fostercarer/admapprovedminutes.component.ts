import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, Renderer2,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../common';
import { PagesComponent } from '../pages.component';
import { APICallService } from '../services/apicallservice.service';
import { environment } from '../../../environments/environment';
import { FormNotificationDTO } from '../systemadmin/DTO/formnotificationdto';
import { UserAuditHistoryDetailDTO } from '../common';
import * as moment from 'moment';
@Component({
    selector: 'ADMApprovedMinutes',
    templateUrl: './admapprovedminutes.component.template.html',
})

export class ADMApprovedMinutesComponent {
    public searchText: string = "";
   
    objNotificationDTO: FormNotificationDTO = new FormNotificationDTO();
    submitted = false;
    _Form: FormGroup;
    PanelAgendaId;
    objQeryVal;
    DateOfEntry;
    panelAgendaForm;
    UserName;
    IsLoading = false;
    controllerName = "PanelMinutesADM";
    panelDate;
    panelCarerList = [];
    AgencyProfileId: number;
    insDecisionStatusList = [];
    ///Save as Draft
    CarerParentId;
    AdminMinutes;
    ChairComments; ChairRecommendation;
    //Docs
    formId;
    tblPrimaryKey;
    TypeId = 0;
    submittedUpload = false;
    showPDFNPrint:boolean=false;
    apiURL = environment.api_url + "/api/GeneratePDF/";
    @ViewChild('uploads') uploadCtrl;
    userTypeCnfgId;
    SequenceNumber;
    @ViewChild('btnPrint') infoPrint: ElementRef;
    @ViewChild('btnCancel') infoCancel: ElementRef;
    subject; eAddress; submittedprint = false; _FormPrint: FormGroup;
    footerMessage={
      'emptyMessage': `<div align=center><strong>No records found.</strong></div>`,
      'totalMessage': ' - Records'
    };
    objUserAuditDetailDTO: UserAuditHistoryDetailDTO = new UserAuditHistoryDetailDTO();
    FormCnfgId=234;
    constructor(private apiService: APICallService, _formBuilder: FormBuilder, private _http: HttpClient,
        private _router: Router, private activatedroute: ActivatedRoute,private model: PagesComponent,
        private pComponent: PagesComponent, private renderer: Renderer2) {
        this.AgencyProfileId = parseInt(Common.GetSession("AgencyProfileId"));
        this._Form = _formBuilder.group({
            ADMDecisionComments: [],
            ADMDecisionStatusId: ['0'],
            ADMDecisionDate: [],
            ADMEchoSignature: [],
            AdminMinutes: [],
            ChairComments: [],
            ChairRecommendation: [],
        });
        this._FormPrint = _formBuilder.group({
            subject: ['', Validators.required],
            eAddress: ['', Validators.required],
            signature: ['']
        });
        this.CarerParentId = parseInt(Common.GetSession("ACarerParentId"));
        if (Common.GetSession("ACarerParentId") == null || Common.GetSession("ACarerParentId") == "0") {
            this._router.navigate(['/pages/fostercarer/approvedcarerlist', 3, 11]);
        }
        else {
            this.BindPanelSetupList();

            this.apiService.get(this.controllerName, "GetPanelRecommendationStatusSelction").then(data => {
                this.insDecisionStatusList = data;

            });
        }
        this.objUserAuditDetailDTO.ActionId = 5;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        this.objUserAuditDetailDTO.RecordNo = 0;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }

    BindPanelSetupList() {

        this.apiService.get(this.controllerName, "GetByCarerParentId", this.CarerParentId).then(data => {
            this.panelCarerList = data;
        });

    }
    IsSelectedId = 0;
    CarerName;
    CaseType;
    jsonDataStr = "";
    selectedItem;
    selectPanelCase(item) {
        this.selectedItem=item;
        this.showPDFNPrint=true;
       // console.log("pp "+item.PanelPlannerInfoId);
        this.TypeId = item.PanelPlannerInfoId;
        this.uploadCtrl.fnSetTypeId(this.TypeId);
        this.uploadCtrl.fnBindUploadDocsForCommon();
        this.uploadCtrl.fnClearQueue();

        this.IsSelectedId = item.PanelPlannerInfoId;
        let scName = "";
        if (item.SCFullName != null)
            scName = item.SCFullName;
        this.CarerName = item.PCFullName + scName + " (" + item.CarerCode + ")";
        this.CaseType = item.PanelCaseName;
        this.panelDate = item.PanelDate;
        this.DateOfEntry = item.PanelMinutesADM.CreatedDate;
        this.AdminMinutes = item.PanelMinutesAdmin.AdminMinutes;
        this.ChairComments = item.PanelMinutesChair.PanelChairComments;
        this.ChairRecommendation = item.PanelMinutesChair.PanelChairRecommendationtoADM;
       
        this.SetDate();
    }

    fnStatusChaneg(value) {
        let id = JSON.parse(value).ADMDecisionStatusId;
        let val = this.insDecisionStatusList.filter(x => x.PanelRecommendationStatusId == id);
        if (val.length > 0) {
            /// alert(val[0].PanelRecommendationStatus);
            return val[0].PanelRecommendationStatus;
        }
    }

    dateString;
    SetDate() {
        

    }
    getRowClass = (row) =>{
      return{
        'rowSelected':row.PanelPlannerInfoId==this.IsSelectedId
      };
    }
    fnDonloadPDF() {
        window.location.href = this.apiURL + "GenerateCarerADMApprovedMinutesPDF/" + this.selectedItem.CarerCode + "," + this.CarerParentId + "," + this.selectedItem.PanelPlannerInfoId + "," + this.AgencyProfileId ;
        this.objUserAuditDetailDTO.ActionId =7;
        //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnDonloadWord() {

        window.location.href = this.apiURL + "GenerateCarerADMApprovedMinutesWord/" + this.selectedItem.CarerCode + "," + this.CarerParentId + "," + this.selectedItem.PanelPlannerInfoId + "," + this.AgencyProfileId ;
        this.objUserAuditDetailDTO.ActionId =6;
        //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
        this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
        this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
        this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
        this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
        Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
    }
    fnPrint() {
        var carerName = this.CarerName.replace('/', '\'');
        this.apiService.get("GeneratePDF", "GenerateCarerADMApprovedMinutesPrint", this.CarerParentId + "," + this.selectedItem.PanelPlannerInfoId + "," + this.AgencyProfileId).then(data => {
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
        //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
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
            this.IsLoading = true;
            this.objNotificationDTO.UserIds = this.eAddress;
            this.objNotificationDTO.Subject = this.subject;
            this.objNotificationDTO.Body = this.CarerParentId + "," +  this.selectedItem.PanelPlannerInfoId + "," + this.AgencyProfileId ;
            this.apiService.post("GeneratePDF", "EmailCarerADMApprovedMinutes", this.objNotificationDTO).then(data => {
                if (data == true){
                    this.model.alertSuccess("Email Send Successfully..");
                    this.objUserAuditDetailDTO.ActionId =9;
                    //this.objUserAuditDetailDTO.RecordNo = this.SequenceNo;
                    this.objUserAuditDetailDTO.ActionDateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                    this.objUserAuditDetailDTO.UserAuditHistoryId=parseInt(Common.GetSession("UserAuditHistoryId"));
                    this.objUserAuditDetailDTO.FormCnfgId = this.FormCnfgId;
                    this.objUserAuditDetailDTO.ChildCarerEmpType = 2;
                    this.objUserAuditDetailDTO.ChildCarerEmpId = this.CarerParentId;
                    Common.addUserAuditHistoryDetails(this.objUserAuditDetailDTO);
                }
                else
                    this.model.alertDanger("Email not Send Successfully..");
                this.fnCancelClick();
                this.IsLoading = false;
            });

        }
    }
    fnCancelClick() {
        let event = new MouseEvent('click', { bubbles: true });
        this.infoCancel.nativeElement.dispatchEvent(event);
    }
}
